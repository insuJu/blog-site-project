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
                private String avatar;
        }

        public static CommentResDto from(Comment comment) {
                return CommentResDto.builder()
                                .id(comment.getId())
                                .content(comment.getContent())
                                .author(comment.getAuthor() != null
                                                ? AuthorInfo.builder()
                                                                .id(comment.getAuthor().getId())
                                                                .username(comment.getAuthor().getUsername())
                                                                .nickname(comment.getAuthor().getProfile().getNickname())
                                                                .avatar(null)
                                                                .build()
                                                : AuthorInfo.builder()
                                                                .id(null)
                                                                .username("탈퇴한 사용자")
                                                                .nickname("탈퇴한 사용자")
                                                                .avatar(null)
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

        public static CommentResDto from(Comment comment, List<CommentResDto> children) {
                return CommentResDto.builder()
                                .id(comment.getId())
                                .content(comment.getContent())
                                .author(comment.getAuthor() != null
                                                ? AuthorInfo.builder()
                                                                .id(comment.getAuthor().getId())
                                                                .username(comment.getAuthor().getUsername())
                                                                .nickname(comment.getAuthor().getProfile().getNickname())
                                                                .avatar(comment.getAuthor().getProfile().getAvatar())
                                                                .build()
                                                : AuthorInfo.builder()
                                                                .id(null)
                                                                .username("탈퇴한 사용자")
                                                                .nickname("탈퇴한 사용자")
                                                                .avatar(null)
                                                                .build())
                                .parentId(comment.getParent() != null ? comment.getParent().getId() : null)
                                .children(children)
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
                                .author(comment.getAuthor() != null
                                                ? AuthorInfo.builder()
                                                                .id(comment.getAuthor().getId())
                                                                .username(comment.getAuthor().getUsername())
                                                                .nickname(comment.getAuthor().getProfile().getNickname())
                                                                .avatar(null)
                                                                .build()
                                                : AuthorInfo.builder()
                                                                .id(null)
                                                                .username("탈퇴한 사용자")
                                                                .nickname("탈퇴한 사용자")
                                                                .avatar(null)
                                                                .build())
                                .parentId(comment.getParent() != null ? comment.getParent().getId() : null)
                                .likeCount(comment.getLikeCount())
                                .isPublic(comment.isPublic())
                                .createdAt(comment.getCreatedAt())
                                .modifiedAt(comment.getModifiedAt())
                                .build();
        }
}
