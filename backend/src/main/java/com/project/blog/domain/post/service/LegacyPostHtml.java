package com.project.blog.domain.post.service;

import java.util.HashSet;
import java.util.Set;
import java.util.regex.Pattern;

import org.jsoup.nodes.Element;
import org.jsoup.nodes.TextNode;

import com.project.blog.global.error.exception.InputBusinessException;

final class LegacyPostHtml {
    private static final Pattern LANGUAGE = Pattern.compile("language-[a-zA-Z0-9_+.-]+");
    private static final Pattern PIXELS = Pattern.compile("[1-9][0-9]{0,8}px");

    private LegacyPostHtml() {
    }

    static void normalize(Element body) {
        for (Element pre : body.select("pre[data-raw-code]")) {
            normalizeCode(pre);
        }
        for (Element image : body.select("img[style]")) {
            normalizeImage(image);
        }
        body.select("[contenteditable]").removeAttr("contenteditable");
        body.select("pre[spellcheck=false]").removeAttr("spellcheck");
        body.select("img[unselectable=on]").removeAttr("unselectable");
        body.select("img[draggable=false]").removeAttr("draggable");
    }

    private static void normalizeCode(Element pre) {
        String raw = pre.attr("data-raw-code");
        Element code = pre.firstElementChild();
        if (code == null || pre.childNodeSize() != 1 || !code.normalName().equals("code")
                || !raw.equals(code.wholeText())) {
            throw PostHtmlPolicy.invalid("코드 블록의 원문과 표시된 코드가 다릅니다.");
        }
        if (!containsOnlyHighlightedText(code)) {
            throw PostHtmlPolicy.invalid("코드 블록의 강조 태그를 안전하게 정리할 수 없습니다.");
        }

        String preLanguage = readLanguage(pre);
        String codeLanguage = readLanguage(code);
        if (!preLanguage.isEmpty() && !codeLanguage.isEmpty() && !preLanguage.equals(codeLanguage)) {
            throw PostHtmlPolicy.invalid("코드 블록의 언어 표시가 서로 다릅니다.");
        }

        // 원문 확인이 끝난 코드에는 강조용 span 대신 텍스트만 남긴다.
        code.text(raw);
        if (codeLanguage.isEmpty() && !preLanguage.isEmpty()) code.attr("class", preLanguage);
        pre.removeAttr("data-raw-code");
    }

    private static String readLanguage(Element element) {
        String language = element.className().strip();
        if (!language.isEmpty() && !LANGUAGE.matcher(language).matches()) {
            throw PostHtmlPolicy.invalid("코드 블록에 지원하지 않는 언어 표시가 있습니다.");
        }
        return language;
    }

    private static boolean containsOnlyHighlightedText(Element code) {
        return code.nodeStream().skip(1).allMatch(node -> node instanceof TextNode
                || (node instanceof Element span && span.normalName().equals("span")
                    && span.attributesSize() == 1 && span.hasClass("token")));
    }

    private static void normalizeImage(Element image) {
        Set<String> properties = new HashSet<>();
        for (String declaration : image.attr("style").split(";")) {
            if (declaration.isBlank()) continue;
            String[] parts = declaration.split(":", 2);
            String property = parts[0].strip();
            if (parts.length != 2 || !properties.add(property)) throw invalidImageSize();
            String value = parts[1].strip();

            switch (property) {
                case "width", "height" -> copyImageDimension(image, property, value);
                case "max-width" -> {
                    if (!value.equals("100%")) throw invalidImageSize();
                }
                case "cursor" -> {
                    if (!value.equals("pointer")) throw invalidImageSize();
                }
                case "user-select" -> {
                    if (!value.equals("none")) throw invalidImageSize();
                }
                default -> throw invalidImageSize();
            }
        }
        image.removeAttr("style");
    }

    private static void copyImageDimension(Element image, String dimension, String value) {
        if (dimension.equals("height") && value.equals("auto") && !image.hasAttr(dimension)) return;
        if (!PIXELS.matcher(value).matches()) throw invalidImageSize();
        String pixels = value.substring(0, value.length() - 2);
        if (image.hasAttr(dimension) && !image.attr(dimension).equals(pixels)) throw invalidImageSize();
        image.attr(dimension, pixels);
    }

    private static InputBusinessException invalidImageSize() {
        return PostHtmlPolicy.invalid("이미지 스타일을 그대로 저장할 수 없습니다. 이미지 크기와 스타일을 확인해 주세요.");
    }
}
