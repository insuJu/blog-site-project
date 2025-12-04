package com.project.blog.domain.tag.dto.req;

import static com.project.blog.global.validation.ValidationConstants.*;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TagReqDto {

    @NotBlank(message = MSG_TAG_NAME_REQUIRED)
    @Size(max = TAG_NAME_MAX_LENGTH, message = MSG_TAG_NAME_SIZE)
    private String name;
}
