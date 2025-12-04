package com.project.blog.domain.comment.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.blog.domain.comment.dto.req.CommentReqDto;
import com.project.blog.domain.comment.dto.res.CommentResDto;
import com.project.blog.domain.comment.service.CommentService;
import com.project.blog.global.dto.ApiResDto;
import com.project.blog.global.security.service.AuthenticatedUser;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequestMapping("/api/posts/{postId}/comments")
@RestController
@RequiredArgsConstructor
public class CommentController {
        private final CommentService commentService;

        @PostMapping
        public ResponseEntity<ApiResDto<CommentResDto>> createComment(
                        @PathVariable("postId") Long postId,
                        @Valid @RequestBody CommentReqDto reqDto,
                        @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
                CommentResDto comment = commentService.createComment(postId, reqDto, authenticatedUser);
                return ResponseEntity.ok(ApiResDto.<CommentResDto>builder()
                                .data(comment)
                                .build());
        }

        @GetMapping
        public ResponseEntity<ApiResDto<List<CommentResDto>>> getCommentsByPostId(
                        @PathVariable("postId") Long postId,
                        @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
                List<CommentResDto> comments = commentService.getCommentsByPostId(postId, authenticatedUser);
                return ResponseEntity.ok(ApiResDto.<List<CommentResDto>>builder()
                                .data(comments)
                                .build());
        }

        @GetMapping("/{id}")
        public ResponseEntity<ApiResDto<CommentResDto>> getCommentById(
                        @PathVariable("postId") Long postId,
                        @PathVariable("id") Long id,
                        @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
                CommentResDto comment = commentService.getCommentById(id, authenticatedUser);
                return ResponseEntity.ok(ApiResDto.<CommentResDto>builder()
                                .data(comment)
                                .build());
        }

        @PutMapping("/{id}")
        public ResponseEntity<ApiResDto<CommentResDto>> updateComment(
                        @PathVariable("postId") Long postId,
                        @PathVariable("id") Long id,
                        @Valid @RequestBody CommentReqDto reqDto,
                        @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
                CommentResDto comment = commentService.updateComment(id, reqDto, authenticatedUser);
                return ResponseEntity.ok(ApiResDto.<CommentResDto>builder()
                                .data(comment)
                                .build());
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<ApiResDto<Void>> deleteComment(
                        @PathVariable("postId") Long postId,
                        @PathVariable("id") Long id,
                        @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
                commentService.deleteComment(id, authenticatedUser);
                return ResponseEntity.ok(ApiResDto.<Void>builder().build());
        }
}
