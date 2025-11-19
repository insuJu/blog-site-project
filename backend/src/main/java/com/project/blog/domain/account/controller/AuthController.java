package com.project.blog.domain.account.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.blog.domain.account.dto.req.LoginReqDto;
import com.project.blog.domain.account.service.AuthService;
import com.project.blog.global.dto.ApiResDto;
import com.project.blog.global.security.service.AuthenticatedUser;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RequestMapping("/api/auth")
@RestController
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResDto<Void>> login(
            @RequestBody LoginReqDto reqDto,
            HttpServletResponse res) {
        authService.login(reqDto, res);
        return ResponseEntity.ok(ApiResDto.<Void>builder().build());
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResDto<Void>> refresh(
            HttpServletRequest req,
            HttpServletResponse res) {
        authService.refresh(req, res);
        return ResponseEntity.ok(ApiResDto.<Void>builder().build());
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResDto<Void>> logout(
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser,
            HttpServletResponse res) {
        authService.logout(authenticatedUser, res);
        return ResponseEntity.ok(ApiResDto.<Void>builder().build());
    }
}
