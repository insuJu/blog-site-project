package com.project.blog.domain.tag.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
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

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequestMapping("/api/tags")
@RestController
@RequiredArgsConstructor
public class TagController {
    private final TagService tagService;

    @PostMapping
    public ResponseEntity<ApiResDto<TagResDto>> createTag(
            @Valid @RequestBody TagReqDto reqDto) {
        TagResDto tag = tagService.createTag(reqDto);
        return ResponseEntity.ok(ApiResDto.<TagResDto>builder()
                .data(tag)
                .build());
    }

    @GetMapping
    public ResponseEntity<ApiResDto<List<TagResDto>>> getAllTags() {
        List<TagResDto> tags = tagService.getAllTags();
        return ResponseEntity.ok(ApiResDto.<List<TagResDto>>builder()
                .data(tags)
                .build());
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResDto<List<TagResDto>>> searchTags(
            @RequestParam("keyword") String keyword) {
        List<TagResDto> tags = tagService.searchTags(keyword);
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
            @Valid @RequestBody TagReqDto reqDto) {
        TagResDto tag = tagService.updateTag(id, reqDto);
        return ResponseEntity.ok(ApiResDto.<TagResDto>builder()
                .data(tag)
                .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResDto<Void>> deleteTag(@PathVariable("id") Long id) {
        tagService.deleteTag(id);
        return ResponseEntity.ok(ApiResDto.<Void>builder().build());
    }

    @DeleteMapping
    public ResponseEntity<ApiResDto<Void>> deleteTags(@RequestBody List<Long> ids) {
        tagService.deleteTags(ids);
        return ResponseEntity.ok(ApiResDto.<Void>builder().build());
    }
}
