package com.project.blog.global.exception;

import org.springframework.http.HttpStatus;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    // Authentication & Authorization
    INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED, "AUTH001", "Invalid username or password."),
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "AUTH002", "Invalid or malformed token."),
    EXPIRED_TOKEN(HttpStatus.UNAUTHORIZED, "AUTH003", "Token has expired."),
    TOKEN_NOT_FOUND(HttpStatus.UNAUTHORIZED, "AUTH004", "Token not found in request."),
    AUTHENTICATION_FAILED(HttpStatus.UNAUTHORIZED, "AUTH005", "Authentication failed."),
    ACCESS_DENIED(HttpStatus.FORBIDDEN, "AUTH006", "Access denied."),

    // Account
    ACCOUNT_NOT_FOUND(HttpStatus.NOT_FOUND, "ACCOUNT001", "Account not found."),
    DUPLICATE_USERNAME(HttpStatus.CONFLICT, "ACCOUNT002", "Username already exists."),
    DUPLICATE_EMAIL(HttpStatus.CONFLICT, "ACCOUNT003", "Email already exists."),

    // Others
    INVALID_INPUT(HttpStatus.BAD_REQUEST, "COMMON001", "Invalid input."),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "COMMON002", "Internal server error.");

    private final HttpStatus status;
    private final String code;
    private final String message;
}
