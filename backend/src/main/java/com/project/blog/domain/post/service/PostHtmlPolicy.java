package com.project.blog.domain.post.service;

import java.util.Map;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.safety.Cleaner;
import org.jsoup.safety.Safelist;

import com.project.blog.global.error.code.ErrorCode;
import com.project.blog.global.error.exception.InputBusinessException;

final class PostHtmlPolicy {
    private static final Cleaner CLEANER = new Cleaner(Safelist.none()
            .addTags("p", "div", "span", "br", "hr", "h1", "h2", "h3", "h4", "h5", "h6",
                    "b", "strong", "i", "em", "u", "s", "strike", "del", "blockquote", "pre", "code",
                    "ul", "ol", "li", "a", "img", "table", "caption", "thead", "tbody", "tfoot", "tr", "th", "td")
            .addAttributes(":all", "id", "class", "title", "lang", "dir")
            .addAttributes("a", "href")
            .addAttributes("img", "src", "alt", "width", "height")
            .addAttributes("ol", "start", "reversed", "type")
            .addAttributes("li", "value", "style")
            .addAttributes("th", "colspan", "rowspan", "scope", "style")
            .addAttributes("td", "colspan", "rowspan", "style")
            .addAttributes("code", "style")
            .addAttributes("pre", "style")
            .addAttributes("div", "style")
            .addAttributes("p", "style")
            .addAttributes("span", "style")
            .addAttributes("h1", "style")
            .addAttributes("h2", "style")
            .addAttributes("h3", "style")
            .addAttributes("h4", "style")
            .addAttributes("h5", "style")
            .addAttributes("h6", "style")
            .addAttributes("strike", "style")
            .addAttributes("br", "style")
            .addProtocols("a", "href", "http", "https", "mailto", "tel")
            .addProtocols("img", "src", "http", "https")
            .preserveRelativeLinks(true));

    private PostHtmlPolicy() {
    }

    static String validate(String html) {
        if (html == null) throw invalid("내용을 입력해 주세요.");

        // 상대 경로에 https:를 적용해 검사하기 때문에 가상의 주소를 부여하여 검사한다.
        Document parsed = Jsoup.parse(html, "https://post.invalid/");
        LegacyPostHtml.normalize(parsed.body());
        // HTML 허용 목록은 style 속성의 위치를 확인하므로, CSS 속성과 값은 먼저 따로 검사한다.
        PostBodyStyles.normalize(parsed.body());
        if (!CLEANER.isValid(parsed)) {
            throw invalid("본문에 지원하지 않는 HTML 태그, 속성 또는 이미지 주소가 있습니다.");
        }

        Document cleaned = CLEANER.clean(parsed);
        if (cleaned.body().text().isBlank() && cleaned.body().select("img[src]").stream().noneMatch(img -> !img.attr("src").isBlank())) {
            throw invalid("내용을 입력해 주세요.");
        }
        // 출력 서식 때문에 코드의 공백과 줄바꿈이 바뀌지 않도록 한다.
        cleaned.outputSettings().prettyPrint(false);
        return cleaned.body().html();
    }

    static InputBusinessException invalid(String message) {
        return new InputBusinessException(ErrorCode.INVALID_INPUT, Map.of("content", message));
    }
}
