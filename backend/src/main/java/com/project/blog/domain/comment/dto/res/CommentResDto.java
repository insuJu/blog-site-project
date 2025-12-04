package com.project.blog.domain.comment.dto.res;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.project.blog.domain.comment.entity.Comment;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CommentResDto {
        private Long id;
        private String content;
        private AuthorInfo author;
        private Long parentId;
        private List<CommentResDto> children;
        private int likeCount;
        private Boolean isPublic;
        private LocalDateTime createdAt;
        private LocalDateTime modifiedAt;

        @JsonProperty("isPublic")
        public boolean isPublic() {
                return isPublic;
        }

        @Getter
        @Builder
        public static class AuthorInfo {
                private Long id;
                private String username;
                private String nickname;
        }

        public static CommentResDto from(Comment comment) {
                return CommentResDto.builder()
                                .id(comment.getId())
                                .content(comment.getContent())
                                .author(AuthorInfo.builder()
                                                .id(comment.getAuthor().getId())
                                                .username(comment.getAuthor().getUsername())
                                                .nickname(comment.getAuthor().getProfile().getNickname())
                                                .build())
                                .parentId(comment.getParent() != null ? comment.getParent().getId() : null)
                                .children(comment.getChildren().stream()
                                                .map(CommentResDto::from)
                                                .collect(Collectors.toList()))
                                .likeCount(comment.getLikeCount())
                                .isPublic(comment.isPublic())
                                .createdAt(comment.getCreatedAt())
                                .modifiedAt(comment.getModifiedAt())
                                .build();
        }

        public static CommentResDto fromWithoutChildren(Comment comment) {
                return CommentResDto.builder()
                                .id(comment.getId())
                                .content(comment.getContent())
                                .author(AuthorInfo.builder()
                                                .id(comment.getAuthor().getId())
                                                .username(comment.getAuthor().getUsername())
                                                .nickname(comment.getAuthor().getProfile().getNickname())
                                                .build())
                                .parentId(comment.getParent() != null ? comment.getParent().getId() : null)
                                .likeCount(comment.getLikeCount())
                                .isPublic(comment.isPublic())
                                .createdAt(comment.getCreatedAt())
                                .modifiedAt(comment.getModifiedAt())
                                .build();
        }
}
