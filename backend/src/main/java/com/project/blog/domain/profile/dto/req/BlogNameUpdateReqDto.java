package com.project.blog.domain.profile.dto.req;

import static com.project.blog.global.validation.ValidationConstants.*;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class BlogNameUpdateReqDto {

    @NotBlank(message = MSG_BLOGNAME_REQUIRED)
    @Size(min = BLOGNAME_MIN_LENGTH, max = BLOGNAME_MAX_LENGTH, message = MSG_BLOGNAME_SIZE)
    private String newBlogName;
}
