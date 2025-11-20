package com.project.blog.domain.profile.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.blog.domain.profile.dto.req.BlogNameUpdateReqDto;
import com.project.blog.domain.profile.dto.req.NicknameUpdateReqDto;
import com.project.blog.domain.profile.service.ProfileService;
import com.project.blog.global.dto.ApiResDto;
import com.project.blog.global.security.service.AuthenticatedUser;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @PutMapping("/me/nickname")
    public ResponseEntity<ApiResDto<Void>> updateNickname(
            @Valid @RequestBody NicknameUpdateReqDto reqDto,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
        profileService.updateNickname(reqDto, authenticatedUser);
        return ResponseEntity.ok(ApiResDto.<Void>builder().build());
    }

    @PutMapping("/me/blog-name")
    public ResponseEntity<ApiResDto<Void>> updateBlogName(
            @Valid @RequestBody BlogNameUpdateReqDto reqDto,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
        profileService.updateBlogName(reqDto, authenticatedUser);
        return ResponseEntity.ok(ApiResDto.<Void>builder().build());
    }
}
