package com.project.blog.domain.like.dto.res;

import java.time.LocalDateTime;

import com.project.blog.domain.like.entity.CommentLike;
import com.project.blog.domain.like.entity.PostLike;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MyLikeResDto {
    private Long id;
    private String type;
    private Long targetId;
    private String targetTitle;
    private Long postId; 
    private String postTitle; 
    private LocalDateTime createdAt;

    public static MyLikeResDto fromPostLike(PostLike postLike) {
        return MyLikeResDto.builder()
                .id(postLike.getId())
                .type("POST")
                .targetId(postLike.getPost().getId())
                .targetTitle(postLike.getPost().getTitle())
                .postId(postLike.getPost().getId())
                .postTitle(postLike.getPost().getTitle())
                .createdAt(postLike.getCreatedAt())
                .build();
    }

    public static MyLikeResDto fromCommentLike(CommentLike commentLike) {
        String preview = commentLike.getComment().getContent();
        if (preview.length() > 50) {
            preview = preview.substring(0, 50) + "...";
        }

        return MyLikeResDto.builder()
                .id(commentLike.getId())
                .type("COMMENT")
                .targetId(commentLike.getComment().getId())
                .targetTitle(preview)
                .postId(commentLike.getComment().getPost().getId())
                .postTitle(commentLike.getComment().getPost().getTitle())
                .createdAt(commentLike.getCreatedAt())
                .build();
    }
}
