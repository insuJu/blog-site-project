package com.project.blog.domain.comment.dto.res;

import java.time.LocalDateTime;

import com.project.blog.domain.comment.entity.Comment;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MyCommentResDto {
    private Long id;
    private String content;
    private Long postId;
    private String postTitle;
    private int likeCount;
    private Boolean isPublic;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;

    public static MyCommentResDto from(Comment comment) {
        return MyCommentResDto.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .postId(comment.getPost().getId())
                .postTitle(comment.getPost().getTitle())
                .likeCount(comment.getLikeCount())
                .isPublic(comment.isPublic())
                .createdAt(comment.getCreatedAt())
                .modifiedAt(comment.getModifiedAt())
                .build();
    }
}
