package com.project.blog.domain.comment.dto.req;

import static com.project.blog.global.validation.ValidationConstants.*;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CommentReqDto {

    @NotBlank(message = MSG_COMMENT_CONTENT_REQUIRED)
    @Size(max = COMMENT_CONTENT_MAX_LENGTH, message = MSG_COMMENT_CONTENT_SIZE)
    private String content;

    private Long parentId;

    private Boolean isPublic;
}
