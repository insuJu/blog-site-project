package com.project.blog.domain.tag.dto.res;

import java.time.LocalDateTime;

import com.project.blog.domain.tag.entity.Tag;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TagResDto {
    private Long id;
    private String name;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;

    public static TagResDto from(Tag tag) {
        return TagResDto.builder()
                .id(tag.getId())
                .name(tag.getName())
                .createdAt(tag.getCreatedAt())
                .modifiedAt(tag.getModifiedAt())
                .build();
    }
}
