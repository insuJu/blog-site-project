package com.project.blog.domain.post.dto.res;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.project.blog.domain.post.entity.Post;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PostResDto {
        private Long id;
        private String title;
        private String content;
        private AuthorInfo author;
        private CategoryInfo category;
        private List<TagInfo> tags;
        private CommentInfo comment;
        private int viewCount;
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

        @Getter
        @Builder
        public static class CategoryInfo {
                private Long id;
                private String name;
        }

        @Getter
        @Builder
        public static class TagInfo {
                private Long id;
                private String name;
        }

        @Getter
        @Builder
        public static class CommentInfo {
                private int count;
        }

        public static PostResDto from(Post post) {
                return PostResDto.builder()
                                .id(post.getId())
                                .title(post.getTitle())
                                .content(post.getContent())
                                .author(AuthorInfo.builder()
                                                .id(post.getAuthor().getId())
                                                .username(post.getAuthor().getUsername())
                                                .nickname(post.getAuthor().getProfile().getNickname())
                                                .avatar(post.getAuthor().getProfile().getAvatar())
                                                .build())
                                .category(post.getCategory() != null
                                                ? CategoryInfo.builder()
                                                                .id(post.getCategory().getId())
                                                                .name(post.getCategory().getName())
                                                                .build()
                                                : null)
                                .tags(post.getTags().stream()
                                                .map(tag -> TagInfo.builder()
                                                                .id(tag.getId())
                                                                .name(tag.getName())
                                                                .build())
                                                .collect(Collectors.toList()))
                                .comment(post.getComments() != null
                                                ? CommentInfo.builder()
                                                                .count(post.getCommentCount())
                                                                .build()
                                                : null)
                                .viewCount(post.getViewCount())
                                .likeCount(post.getLikeCount())
                                .isPublic(post.isPublic())
                                .createdAt(post.getCreatedAt())
                                .modifiedAt(post.getModifiedAt())
                                .build();
        }
}
