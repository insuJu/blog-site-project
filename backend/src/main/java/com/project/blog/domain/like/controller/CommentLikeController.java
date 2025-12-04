package com.project.blog.domain.like.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.blog.domain.like.service.CommentLikeService;
import com.project.blog.global.dto.ApiResDto;
import com.project.blog.global.security.service.AuthenticatedUser;

import lombok.RequiredArgsConstructor;

@RequestMapping("/api/comments/{commentId}/like")
@RestController
@RequiredArgsConstructor
public class CommentLikeController {
    private final CommentLikeService commentLikeService;

    @PostMapping
    public ResponseEntity<ApiResDto<Boolean>> toggleCommentLike(
            @PathVariable("commentId") Long commentId,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
        boolean liked = commentLikeService.toggleCommentLike(commentId, authenticatedUser);
        return ResponseEntity.ok(ApiResDto.<Boolean>builder()
                .data(liked) 
                .build());
    }

    @GetMapping
    public ResponseEntity<ApiResDto<Boolean>> isCommentLiked(
            @PathVariable("commentId") Long commentId,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
        boolean liked = commentLikeService.isCommentLiked(commentId, authenticatedUser);
        return ResponseEntity.ok(ApiResDto.<Boolean>builder()
                .data(liked)
                .build());
    }
}
