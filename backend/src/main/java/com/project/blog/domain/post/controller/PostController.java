package com.project.blog.domain.post.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.project.blog.domain.post.dto.req.PostReqDto;
import com.project.blog.domain.post.dto.res.PostResDto;
import com.project.blog.domain.post.service.PostService;
import com.project.blog.global.dto.ApiResDto;
import com.project.blog.global.file.service.FileService;
import com.project.blog.global.security.service.AuthenticatedUser;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequestMapping("/api/posts")
@RestController
@RequiredArgsConstructor
public class PostController {
        private final PostService postService;
        private final FileService fileService;

        @PostMapping
        public ResponseEntity<ApiResDto<PostResDto>> createPost(
                        @Valid @RequestBody PostReqDto reqDto,
                        @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
                PostResDto post = postService.createPost(reqDto, authenticatedUser);
                return ResponseEntity.ok(ApiResDto.<PostResDto>builder()
                                .data(post)
                                .build());
        }

        @GetMapping
        public ResponseEntity<ApiResDto<Page<PostResDto>>> getAllPosts(
                        @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
                Page<PostResDto> posts = postService.getAllPosts(pageable);
                return ResponseEntity.ok(ApiResDto.<Page<PostResDto>>builder()
                                .data(posts)
                                .build());
        }

        @GetMapping("/{id}")
        public ResponseEntity<ApiResDto<PostResDto>> getPostById(@PathVariable("id") Long id) {
                PostResDto post = postService.getPostById(id);
                return ResponseEntity.ok(ApiResDto.<PostResDto>builder()
                                .data(post)
                                .build());
        }

        @GetMapping("/author/{authorId}")
        public ResponseEntity<ApiResDto<Page<PostResDto>>> getPostsByAuthor(
                        @PathVariable("authorId") Long authorId,
                        @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
                        @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
                Long requesterId = (authenticatedUser != null) ? authenticatedUser.getAccount().getId() : null;
                Page<PostResDto> posts = postService.getPostsByAuthor(authorId, pageable, requesterId);
                return ResponseEntity.ok(ApiResDto.<Page<PostResDto>>builder()
                                .data(posts)
                                .build());
        }

        @GetMapping("/category/{categoryId}")
        public ResponseEntity<ApiResDto<Page<PostResDto>>> getPostsByCategory(
                        @PathVariable("categoryId") Long categoryId,
                        @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
                Page<PostResDto> posts = postService.getPostsByCategory(categoryId, pageable);
                return ResponseEntity.ok(ApiResDto.<Page<PostResDto>>builder()
                                .data(posts)
                                .build());
        }

        @GetMapping("/tag/{tagName}")
        public ResponseEntity<ApiResDto<Page<PostResDto>>> getPostsByTag(
                        @PathVariable("tagName") String tagName,
                        @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
                Page<PostResDto> posts = postService.getPostsByTag(tagName, pageable);
                return ResponseEntity.ok(ApiResDto.<Page<PostResDto>>builder()
                                .data(posts)
                                .build());
        }

        @GetMapping("/search")
        public ResponseEntity<ApiResDto<Page<PostResDto>>> searchPosts(
                        @RequestParam String keyword,
                        @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
                Page<PostResDto> posts = postService.searchPosts(keyword, pageable);
                return ResponseEntity.ok(ApiResDto.<Page<PostResDto>>builder()
                                .data(posts)
                                .build());
        }

        @GetMapping("/author/{authorId}/search")
        public ResponseEntity<ApiResDto<Page<PostResDto>>> searchPostsByAuthor(
                        @PathVariable("authorId") Long authorId,
                        @RequestParam String keyword,
                        @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
                        @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
                Long requesterId = (authenticatedUser != null) ? authenticatedUser.getAccount().getId() : null;
                Page<PostResDto> posts = postService.searchPostsByAuthor(authorId, keyword, pageable, requesterId);
                return ResponseEntity.ok(ApiResDto.<Page<PostResDto>>builder()
                                .data(posts)
                                .build());
        }

        @PutMapping("/{id}")
        public ResponseEntity<ApiResDto<PostResDto>> updatePost(
                        @PathVariable("id") Long id,
                        @Valid @RequestBody PostReqDto reqDto,
                        @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
                PostResDto post = postService.updatePost(id, reqDto, authenticatedUser);
                return ResponseEntity.ok(ApiResDto.<PostResDto>builder()
                                .data(post)
                                .build());
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<ApiResDto<Void>> deletePost(
                        @PathVariable("id") Long id,
                        @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
                postService.deletePost(id, authenticatedUser);
                return ResponseEntity.ok(ApiResDto.<Void>builder().build());
        }

        @DeleteMapping
        public ResponseEntity<ApiResDto<Void>> deletePosts(
                        @RequestBody List<Long> ids,
                        @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
                postService.deletePosts(ids, authenticatedUser);
                return ResponseEntity.ok(ApiResDto.<Void>builder().build());
        }

        @PostMapping("/images")
        public ResponseEntity<ApiResDto<String>> uploadImage(
                        @RequestParam("file") MultipartFile file,
                        @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
                String imageUrl = fileService.uploadPostImage(file);
                return ResponseEntity.ok(ApiResDto.<String>builder()
                                .data(imageUrl)
                                .build());
        }
}
