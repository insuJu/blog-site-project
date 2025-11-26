package com.project.blog.domain.account.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.blog.domain.account.dto.req.EmailUpdateReqDto;
import com.project.blog.domain.account.dto.req.PasswordUpdateReqDto;
import com.project.blog.domain.account.dto.req.SignupReqDto;
import com.project.blog.domain.account.dto.res.UserInfoResDto;
import com.project.blog.domain.account.service.AccountService;
import com.project.blog.global.dto.ApiResDto;
import com.project.blog.global.security.service.AuthenticatedUser;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequestMapping("/api/users")
@RestController
@RequiredArgsConstructor
public class AccountController {
    private final AccountService accountService;

    @PostMapping("/signup")
    public ResponseEntity<ApiResDto<Void>> signup(
            @Valid @RequestBody SignupReqDto reqDto) {
        accountService.signup(reqDto);
        return ResponseEntity.ok(ApiResDto.<Void>builder().build());
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResDto<UserInfoResDto>> getUserInfo(
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
        UserInfoResDto userInfo = accountService.getUserInfo(authenticatedUser);
        return ResponseEntity.ok(ApiResDto.<UserInfoResDto>builder()
                .data(userInfo)
                .build());
    }

    @PutMapping("/me/email")
    public ResponseEntity<ApiResDto<Void>> updateEmail(
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser,
            @Valid @RequestBody EmailUpdateReqDto reqDto) {
        accountService.updateEmail(reqDto, authenticatedUser);
        return ResponseEntity.ok(ApiResDto.<Void>builder().build());
    }

    @PutMapping("/me/password")
    public ResponseEntity<ApiResDto<Void>> updatePassword(
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser,
            @Valid @RequestBody PasswordUpdateReqDto reqDto) {
        accountService.updatePassword(reqDto, authenticatedUser);
        return ResponseEntity.ok(ApiResDto.<Void>builder().build());
    }
}
