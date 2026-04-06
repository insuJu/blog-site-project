package com.project.blog.domain.comment.dto.res;

import java.time.LocalDateTime;

import com.project.blog.domain.comment.entity.Comment;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CommentSummaryResDto {
    private Long id;
    private String content;
    private Long postId;
    private String postTitle;
    private String authorNickname;
    private int likeCount;
    private Boolean isPublic;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;

    public static CommentSummaryResDto from(Comment comment) {
        return CommentSummaryResDto.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .postId(comment.getPost().getId())
                .postTitle(comment.getPost().getTitle())
                .authorNickname(comment.getAuthor() != null ? comment.getAuthor().getProfile().getNickname() : "탈퇴한 사용자")
                .likeCount(comment.getLikeCount())
                .isPublic(comment.isPublic())
                .createdAt(comment.getCreatedAt())
                .modifiedAt(comment.getModifiedAt())
                .build();
    }
}
