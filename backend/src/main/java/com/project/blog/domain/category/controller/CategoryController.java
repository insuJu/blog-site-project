package com.project.blog.domain.category.controller;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.blog.domain.category.dto.req.CategoryReqDto;
import com.project.blog.domain.category.dto.res.CategoryResDto;
import com.project.blog.domain.category.service.CategoryService;
import com.project.blog.global.dto.ApiResDto;
import com.project.blog.global.security.service.AuthenticatedUser;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequestMapping("/api/categories")
@RestController
@RequiredArgsConstructor
public class CategoryController {
        private final CategoryService categoryService;

        @PostMapping
        public ResponseEntity<ApiResDto<CategoryResDto>> createCategory(
                        @Valid @RequestBody CategoryReqDto reqDto,
                        @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
                CategoryResDto category = categoryService.createCategory(reqDto,
                                authenticatedUser.getAccount().getId());
                return ResponseEntity.ok(ApiResDto.<CategoryResDto>builder()
                                .data(category)
                                .build());
        }

        @GetMapping
        public ResponseEntity<ApiResDto<List<CategoryResDto>>> getAllCategories(
                        @RequestParam(required = false) Long accountId,
                        @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
                Long targetAccountId = accountId != null ? accountId : authenticatedUser.getAccount().getId();
                List<CategoryResDto> categories = categoryService.getAllCategories(targetAccountId);
                return ResponseEntity.ok(ApiResDto.<List<CategoryResDto>>builder()
                                .data(categories)
                                .build());
        }

        @GetMapping("/{id}")
        public ResponseEntity<ApiResDto<CategoryResDto>> getCategoryById(@PathVariable Long id) {
                CategoryResDto category = categoryService.getCategoryById(id);
                return ResponseEntity.ok(ApiResDto.<CategoryResDto>builder()
                                .data(category)
                                .build());
        }

        @GetMapping("/{id}/children")
        public ResponseEntity<ApiResDto<List<CategoryResDto>>> getCategoriesByParentId(
                        @PathVariable Long id,
                        @RequestParam(required = false) Long accountId,
                        @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
                Long targetAccountId = accountId != null ? accountId : authenticatedUser.getAccount().getId();
                List<CategoryResDto> categories = categoryService.getCategoriesByParentId(id, targetAccountId);
                return ResponseEntity.ok(ApiResDto.<List<CategoryResDto>>builder()
                                .data(categories)
                                .build());
        }

        @PutMapping("/{id}")
        public ResponseEntity<ApiResDto<CategoryResDto>> updateCategory(
                        @PathVariable Long id,
                        @Valid @RequestBody CategoryReqDto reqDto,
                        @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
                CategoryResDto category = categoryService.updateCategory(id, reqDto, authenticatedUser);
                return ResponseEntity.ok(ApiResDto.<CategoryResDto>builder()
                                .data(category)
                                .build());
        }

        @DeleteMapping
        public ResponseEntity<ApiResDto<Void>> deleteCategories(
                        @RequestBody List<Long> ids,
                        @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
                categoryService.deleteCategories(ids, authenticatedUser);
                return ResponseEntity.ok(ApiResDto.<Void>builder().build());
        }
}
