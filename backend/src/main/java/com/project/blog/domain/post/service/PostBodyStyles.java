package com.project.blog.domain.post.service;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.jsoup.nodes.Element;

final class PostBodyStyles {
    private static final Set<String> TYPOGRAPHY_TAGS = Set.of("p", "div", "span", "h1", "h2", "h3", "h4", "h5", "h6");
    private static final Set<String> STYLE_TAGS = Set.of("strike", "br", "li", "pre", "code", "th", "td");
    private static final Set<String> TABLE_ALIGNMENTS = Set.of("left", "center", "right");
    private static final Set<String> CODE_TAGS = Set.of("pre", "code");
    private static final Pattern COLOR = Pattern.compile(
            "#(?:[a-fA-F0-9]{3}|[a-fA-F0-9]{6})|rgb\\(\\s*[0-9]{1,3}\\s*,\\s*[0-9]{1,3}\\s*,\\s*[0-9]{1,3}\\s*\\)");
    private static final Pattern NAMED_COLOR = Pattern.compile("[a-zA-Z]{1,24}");
    private static final Pattern FONT_SIZE = Pattern.compile("[0-9]{1,3}(?:\\.[0-9]{1,2})?(?:px|em|rem|%)");
    private static final Pattern CODE_SPACING = Pattern.compile("[0-9]{1,2}px(?: [0-9]{1,2}px)?");
    private static final Pattern LINE_HEIGHT = Pattern.compile("[1-3](?:\\.[0-9]{1,2})?");

    private PostBodyStyles() {
    }

    static void normalize(Element body) {
        for (Element font : body.select("font[color]")) {
            String color = font.attr("color").strip();
            if (font.attributesSize() != 1 || !COLOR.matcher(color).matches()) {
                throw PostHtmlPolicy.invalid("지원하지 않는 글자 색상이나 글꼴 속성이 있습니다.");
            }
            font.tagName("span").removeAttr("color").attr("style", "color: " + color);
        }
        for (Element element : body.select("[style]")) {
            if (element.attr("style").isBlank()) {
                element.removeAttr("style");
                continue;
            }
            String tag = element.normalName();
            if (!STYLE_TAGS.contains(tag) && !TYPOGRAPHY_TAGS.contains(tag)) {
                throw PostHtmlPolicy.invalid("본문에 지원하지 않는 스타일이 있습니다.");
            }
            Map<String, String> declarations = new LinkedHashMap<>();
            for (String declaration : element.attr("style").split(";")) {
                if (declaration.isBlank()) continue;
                String[] parts = declaration.split(":", 2);
                String name = parts[0].strip();
                String value = parts.length == 2 ? parts[1].strip() : "";
                if (!isSupported(tag, name, value) || declarations.putIfAbsent(name, value) != null) {
                    throw PostHtmlPolicy.invalid("본문에 지원하지 않는 스타일이 있습니다.");
                }
            }
            if (declarations.isEmpty()) element.removeAttr("style");
            else {
                String style = declarations.entrySet().stream()
                        .map(entry -> entry.getKey() + ": " + entry.getValue()).collect(Collectors.joining("; "));
                // 표 셀의 직렬화 형태를 편집기와 맞춰 저장 후에도 시각 편집으로 열 수 있게 한다.
                element.attr("style", tag.equals("th") || tag.equals("td") ? style + ";" : style);
            }
        }
    }

    private static boolean isSupported(String tag, String name, String value) {
        if (TYPOGRAPHY_TAGS.contains(tag)) {
            return switch (name) {
                case "color" -> COLOR.matcher(value).matches() || NAMED_COLOR.matcher(value).matches();
                case "font-size" -> FONT_SIZE.matcher(value).matches();
                case "font-weight" -> value.equals("normal") || value.matches("[1-9]00");
                default -> false;
            };
        }
        if (tag.equals("th") || tag.equals("td")) {
            return name.equals("text-align") && TABLE_ALIGNMENTS.contains(value);
        }
        boolean code = CODE_TAGS.contains(tag);
        return switch (name) {
            case "color" -> code && COLOR.matcher(value).matches();
            case "font-size" -> !tag.equals("li") && FONT_SIZE.matcher(value).matches();
            case "text-decoration-line" -> tag.equals("li") && value.equals("line-through");
            case "background-color" -> code && COLOR.matcher(value).matches();
            case "border-radius", "padding" -> code && CODE_SPACING.matcher(value).matches();
            case "font-family" -> code && value.equals("monospace");
            case "line-height" -> tag.equals("pre") && LINE_HEIGHT.matcher(value).matches();
            case "overflow" -> tag.equals("pre") && value.equals("auto");
            case "white-space" -> tag.equals("pre") && (value.equals("pre") || value.equals("pre-wrap"));
            default -> false;
        };
    }
}
