package com.project.blog.domain.tag.controller;

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

import com.project.blog.domain.tag.dto.req.TagReqDto;
import com.project.blog.domain.tag.dto.res.TagResDto;
import com.project.blog.domain.tag.service.TagService;
import com.project.blog.global.dto.ApiResDto;
import com.project.blog.global.security.service.AuthenticatedUser;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequestMapping("/api/tags")
@RestController
@RequiredArgsConstructor
public class TagController {
    private final TagService tagService;

    @PostMapping
    public ResponseEntity<ApiResDto<TagResDto>> createTag(
            @Valid @RequestBody TagReqDto reqDto,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
        TagResDto tag = tagService.createTag(reqDto, authenticatedUser.getAccount().getId());
        return ResponseEntity.ok(ApiResDto.<TagResDto>builder()
                .data(tag)
                .build());
    }

    @GetMapping
    public ResponseEntity<ApiResDto<List<TagResDto>>> getAllTags(
            @RequestParam(required = false) Long accountId,
            @AuthenticationPrincipal(errorOnInvalidType = true) AuthenticatedUser authenticatedUser) {
        Long targetAccountId = accountId != null ? accountId : authenticatedUser.getAccount().getId();
        List<TagResDto> tags = tagService.getAllTags(targetAccountId);
        return ResponseEntity.ok(ApiResDto.<List<TagResDto>>builder()
                .data(tags)
                .build());
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResDto<List<TagResDto>>> searchTags(
            @RequestParam("keyword") String keyword,
            @RequestParam(required = false) Long accountId,
            @AuthenticationPrincipal(errorOnInvalidType = true) AuthenticatedUser authenticatedUser) {
        Long targetAccountId = accountId != null ? accountId : authenticatedUser.getAccount().getId();
        List<TagResDto> tags = tagService.searchTags(keyword, targetAccountId);
        return ResponseEntity.ok(ApiResDto.<List<TagResDto>>builder()
                .data(tags)
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResDto<TagResDto>> getTagById(@PathVariable("id") Long id) {
        TagResDto tag = tagService.getTagById(id);
        return ResponseEntity.ok(ApiResDto.<TagResDto>builder()
                .data(tag)
                .build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResDto<TagResDto>> updateTag(
            @PathVariable("id") Long id,
            @Valid @RequestBody TagReqDto reqDto,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
        TagResDto tag = tagService.updateTag(id, reqDto, authenticatedUser);
        return ResponseEntity.ok(ApiResDto.<TagResDto>builder()
                .data(tag)
                .build());
    }

    @DeleteMapping
    public ResponseEntity<ApiResDto<Void>> deleteTags(
            @RequestBody List<Long> ids,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
        tagService.deleteTags(ids, authenticatedUser);
        return ResponseEntity.ok(ApiResDto.<Void>builder().build());
    }
}
