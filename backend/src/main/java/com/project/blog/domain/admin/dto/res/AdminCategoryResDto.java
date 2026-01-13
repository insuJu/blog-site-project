package com.project.blog.domain.admin.dto.res;

import java.time.LocalDateTime;

import com.project.blog.domain.category.entity.Category;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdminCategoryResDto {
    private Long id;
    private String name;
    private Long parentId;
    private String parentName;
    private int childrenCount;
    private Long postCount;
    private LocalDateTime createdAt;

    public static AdminCategoryResDto from(Category category, Long postCount) {
        return AdminCategoryResDto.builder()
            .id(category.getId())
            .name(category.getName())
            .parentId(category.getParent() != null ? category.getParent().getId() : null)
            .parentName(category.getParent() != null ? category.getParent().getName() : null)
            .childrenCount(category.getChildren() != null ? category.getChildren().size() : 0)
            .postCount(postCount)
            .createdAt(category.getCreatedAt())
            .build();
    }
}
