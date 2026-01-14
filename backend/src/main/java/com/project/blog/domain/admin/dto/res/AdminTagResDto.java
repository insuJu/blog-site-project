package com.project.blog.domain.admin.dto.res;

import java.time.LocalDateTime;

import com.project.blog.domain.tag.entity.Tag;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdminTagResDto {
    private Long id;
    private String name;
    private Long postCount;
    private LocalDateTime createdAt;
    private String ownerUsername;

    public static AdminTagResDto from(Tag tag, Long postCount, String ownerUsername) {
        return AdminTagResDto.builder()
                .id(tag.getId())
                .name(tag.getName())
                .postCount(postCount)
                .createdAt(tag.getCreatedAt())
                .ownerUsername(ownerUsername)
                .build();
    }
}
