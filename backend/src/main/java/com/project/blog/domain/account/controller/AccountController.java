package com.project.blog.domain.account.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.blog.domain.account.dto.req.AccountDeactivationVerifyReqDto;
import com.project.blog.domain.account.dto.req.EmailUpdateReqDto;
import com.project.blog.domain.account.dto.req.FindUsernameReqDto;
import com.project.blog.domain.account.dto.req.PasswordResetRequestReqDto;
import com.project.blog.domain.account.dto.req.PasswordResetVerifyReqDto;
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

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResDto<UserInfoResDto>> getUserInfoById(
            @PathVariable("userId") Long userId) {
        UserInfoResDto userInfo = accountService.getUserInfoById(userId);
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

    @PostMapping("/me/deactivation/request")
    public ResponseEntity<ApiResDto<Void>> requestAccountDeactivation(
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
        accountService.requestAccountDeactivation(authenticatedUser);
        return ResponseEntity.ok(ApiResDto.<Void>builder().build());
    }

    @PostMapping("/me/deactivation/verify")
    public ResponseEntity<ApiResDto<Void>> verifyAccountDeactivation(
            @Valid @RequestBody AccountDeactivationVerifyReqDto reqDto,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
        accountService.verifyAccountDeactivation(reqDto, authenticatedUser);
        return ResponseEntity.ok(ApiResDto.<Void>builder().build());
    }

    @PostMapping("/me/reactivate")
    public ResponseEntity<ApiResDto<Void>> reactivateAccount(
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
        accountService.reactivateAccount(authenticatedUser);
        return ResponseEntity.ok(ApiResDto.<Void>builder().build());
    }

    @PostMapping("/find-username")
    public ResponseEntity<ApiResDto<Void>> findUsername(
            @Valid @RequestBody FindUsernameReqDto reqDto) {
        accountService.findUsername(reqDto);
        return ResponseEntity.ok(ApiResDto.<Void>builder().build());
    }

    @PostMapping("/password-reset/request")
    public ResponseEntity<ApiResDto<Void>> requestPasswordReset(
            @Valid @RequestBody PasswordResetRequestReqDto reqDto) {
        accountService.requestPasswordReset(reqDto);
        return ResponseEntity.ok(ApiResDto.<Void>builder().build());
    }

    @PostMapping("/password-reset/verify")
    public ResponseEntity<ApiResDto<Void>> verifyPasswordReset(
            @Valid @RequestBody PasswordResetVerifyReqDto reqDto) {
        accountService.verifyPasswordReset(reqDto);
        return ResponseEntity.ok(ApiResDto.<Void>builder().build());
    }
}
