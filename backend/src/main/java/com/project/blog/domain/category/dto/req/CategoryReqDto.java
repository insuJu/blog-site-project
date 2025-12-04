package com.project.blog.domain.category.dto.req;

import static com.project.blog.global.validation.ValidationConstants.*;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CategoryReqDto {

    @NotBlank(message = MSG_CATEGORY_NAME_REQUIRED)
    @Size(max = CATEGORY_NAME_MAX_LENGTH, message = MSG_CATEGORY_NAME_SIZE)
    private String name;

    private Long parentId;
}
