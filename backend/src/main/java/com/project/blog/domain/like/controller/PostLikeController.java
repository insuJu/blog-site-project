package com.project.blog.domain.like.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.blog.domain.like.dto.res.MyLikeResDto;
import com.project.blog.domain.like.service.PostLikeService;
import com.project.blog.global.dto.ApiResDto;
import com.project.blog.global.security.service.AuthenticatedUser;

import lombok.RequiredArgsConstructor;

@RequestMapping("/api/posts/")
@RestController
@RequiredArgsConstructor
public class PostLikeController {
        private final PostLikeService postLikeService;

        @PostMapping("{postId}/like")
        public ResponseEntity<ApiResDto<Boolean>> togglePostLike(
                        @PathVariable("postId") Long postId,
                        @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
                boolean liked = postLikeService.togglePostLike(postId, authenticatedUser);
                return ResponseEntity.ok(ApiResDto.<Boolean>builder()
                                .data(liked)
                                .build());
        }

        @GetMapping("{postId}/like")
        public ResponseEntity<ApiResDto<Boolean>> isPostLiked(
                        @PathVariable("postId") Long postId,
                        @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
                boolean liked = postLikeService.isPostLiked(postId, authenticatedUser);
                return ResponseEntity.ok(ApiResDto.<Boolean>builder()
                                .data(liked)
                                .build());
        }

        @GetMapping("likes/me")
        public ResponseEntity<ApiResDto<List<MyLikeResDto>>> getMyPostLikes(
                        @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
                List<MyLikeResDto> likes = postLikeService.getMyPostLikes(authenticatedUser);
                return ResponseEntity.ok(ApiResDto.<List<MyLikeResDto>>builder()
                                .data(likes)
                                .build());
        }
}
