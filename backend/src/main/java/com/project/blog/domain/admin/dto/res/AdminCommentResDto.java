package com.project.blog.domain.admin.dto.res;

import java.time.LocalDateTime;

import com.project.blog.domain.comment.entity.Comment;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdminCommentResDto {
    private Long id;
    private String content;
    private String authorUsername;
    private String authorNickname;
    private Long authorId;
    private Long postId;
    private String postTitle;
    private Long parentId;
    private boolean isPublic;
    private int likeCount;
    private int replyCount;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;

    public static AdminCommentResDto from(Comment comment) {
        return AdminCommentResDto.builder()
            .id(comment.getId())
            .content(comment.getContent())
            .authorUsername(comment.getAuthor() != null ? comment.getAuthor().getUsername() : null)
            .authorNickname(comment.getAuthor() != null && comment.getAuthor().getProfile() != null
                ? comment.getAuthor().getProfile().getNickname() : null)
            .authorId(comment.getAuthor() != null ? comment.getAuthor().getId() : null)
            .postId(comment.getPost() != null ? comment.getPost().getId() : null)
            .postTitle(comment.getPost() != null ? comment.getPost().getTitle() : null)
            .parentId(comment.getParent() != null ? comment.getParent().getId() : null)
            .isPublic(comment.isPublic())
            .likeCount(comment.getLikeCount())
            .replyCount(comment.getChildren() != null ? comment.getChildren().size() : 0)
            .createdAt(comment.getCreatedAt())
            .modifiedAt(comment.getModifiedAt())
            .build();
    }
}
