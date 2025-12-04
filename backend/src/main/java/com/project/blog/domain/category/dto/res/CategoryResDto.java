package com.project.blog.domain.category.dto.res;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.project.blog.domain.category.entity.Category;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CategoryResDto {
    private Long id;
    private String name;
    private Long parentId;
    private List<CategoryResDto> children;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;

    public static CategoryResDto from(Category category) {
        return CategoryResDto.builder()
                .id(category.getId())
                .name(category.getName())
                .parentId(category.getParent() != null ? category.getParent().getId() : null)
                .children(category.getChildren().stream()
                        .map(CategoryResDto::from)
                        .collect(Collectors.toList()))
                .createdAt(category.getCreatedAt())
                .modifiedAt(category.getModifiedAt())
                .build();
    }

    public static CategoryResDto fromWithoutChildren(Category category) {
        return CategoryResDto.builder()
                .id(category.getId())
                .name(category.getName())
                .parentId(category.getParent() != null ? category.getParent().getId() : null)
                .createdAt(category.getCreatedAt())
                .modifiedAt(category.getModifiedAt())
                .build();
    }
}
