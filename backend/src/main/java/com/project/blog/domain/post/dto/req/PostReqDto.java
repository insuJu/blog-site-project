package com.project.blog.domain.post.dto.req;

import static com.project.blog.global.validation.ValidationConstants.*;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PostReqDto {

    @NotBlank(message = MSG_POST_TITLE_REQUIRED)
    @Size(max = POST_TITLE_MAX_LENGTH, message = MSG_POST_TITLE_SIZE)
    private String title;

    @NotBlank(message = MSG_POST_CONTENT_REQUIRED)
    private String content;

    private Long categoryId;

    private List<String> tagNames;

    private Boolean isPublic;
}
