package com.project.blog.domain.admin.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.blog.domain.admin.dto.res.AdminAccountResDto;
import com.project.blog.domain.admin.dto.res.AdminCategoryResDto;
import com.project.blog.domain.admin.dto.res.AdminCommentResDto;
import com.project.blog.domain.admin.dto.res.AdminPostResDto;
import com.project.blog.domain.admin.dto.res.AdminStatsResDto;
import com.project.blog.domain.admin.dto.res.AdminTagResDto;
import com.project.blog.domain.admin.service.AdminService;
import com.project.blog.global.dto.ApiResDto;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminController {
    private final AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResDto<AdminStatsResDto>> getStats() {
        AdminStatsResDto stats = adminService.getStats();
        return ResponseEntity.ok(ApiResDto.<AdminStatsResDto>builder()
            .data(stats)
            .build());
    }

    @GetMapping("/accounts")
    public ResponseEntity<ApiResDto<Page<AdminAccountResDto>>> getAllAccounts(
        @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<AdminAccountResDto> accounts = adminService.getAllAccounts(pageable);
        return ResponseEntity.ok(ApiResDto.<Page<AdminAccountResDto>>builder()
            .data(accounts)
            .build());
    }

    @DeleteMapping("/accounts/{id}")
    public ResponseEntity<ApiResDto<Void>> deleteAccount(@PathVariable("id") Long id) {
        adminService.deleteAccount(id);
        return ResponseEntity.ok(ApiResDto.<Void>builder()
            .build());
    }

    @GetMapping("/posts")
    public ResponseEntity<ApiResDto<Page<AdminPostResDto>>> getAllPosts(
        @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<AdminPostResDto> posts = adminService.getAllPosts(pageable);
        return ResponseEntity.ok(ApiResDto.<Page<AdminPostResDto>>builder()
            .data(posts)
            .build());
    }

    @DeleteMapping("/posts/{id}")
    public ResponseEntity<ApiResDto<Void>> deletePost(@PathVariable("id") Long id) {
        adminService.deletePost(id);
        return ResponseEntity.ok(ApiResDto.<Void>builder()
            .build());
    }

    @GetMapping("/comments")
    public ResponseEntity<ApiResDto<Page<AdminCommentResDto>>> getAllComments(
        @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<AdminCommentResDto> comments = adminService.getAllComments(pageable);
        return ResponseEntity.ok(ApiResDto.<Page<AdminCommentResDto>>builder()
            .data(comments)
            .build());
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<ApiResDto<Void>> deleteComment(@PathVariable("id") Long id) {
        adminService.deleteComment(id);
        return ResponseEntity.ok(ApiResDto.<Void>builder()
            .build());
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResDto<List<AdminCategoryResDto>>> getAllCategories() {
        List<AdminCategoryResDto> categories = adminService.getAllCategories();
        return ResponseEntity.ok(ApiResDto.<List<AdminCategoryResDto>>builder()
            .data(categories)
            .build());
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<ApiResDto<Void>> deleteCategory(@PathVariable("id") Long id) {
        adminService.deleteCategory(id);
        return ResponseEntity.ok(ApiResDto.<Void>builder()
            .build());
    }

    @GetMapping("/tags")
    public ResponseEntity<ApiResDto<Page<AdminTagResDto>>> getAllTags(
        @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<AdminTagResDto> tags = adminService.getAllTags(pageable);
        return ResponseEntity.ok(ApiResDto.<Page<AdminTagResDto>>builder()
            .data(tags)
            .build());
    }

    @DeleteMapping("/tags/{id}")
    public ResponseEntity<ApiResDto<Void>> deleteTag(@PathVariable("id") Long id) {
        adminService.deleteTag(id);
        return ResponseEntity.ok(ApiResDto.<Void>builder()
            .build());
    }
}
