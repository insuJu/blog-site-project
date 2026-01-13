package com.project.blog.domain.admin.dto.res;

import java.time.LocalDateTime;

import com.project.blog.domain.post.entity.Post;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdminPostResDto {
    private Long id;
    private String title;
    private String authorUsername;
    private String authorNickname;
    private Long authorId;
    private String categoryName;
    private boolean isPublic;
    private int viewCount;
    private int likeCount;
    private int commentCount;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;

    public static AdminPostResDto from(Post post) {
        return AdminPostResDto.builder()
            .id(post.getId())
            .title(post.getTitle())
            .authorUsername(post.getAuthor() != null ? post.getAuthor().getUsername() : null)
            .authorNickname(post.getAuthor() != null && post.getAuthor().getProfile() != null
                ? post.getAuthor().getProfile().getNickname() : null)
            .authorId(post.getAuthor() != null ? post.getAuthor().getId() : null)
            .categoryName(post.getCategory() != null ? post.getCategory().getName() : null)
            .isPublic(post.isPublic())
            .viewCount(post.getViewCount())
            .likeCount(post.getLikeCount())
            .commentCount(post.getCommentCount())
            .createdAt(post.getCreatedAt())
            .modifiedAt(post.getModifiedAt())
            .build();
    }
}
