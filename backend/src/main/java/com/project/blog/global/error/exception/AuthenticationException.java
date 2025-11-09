package com.project.blog.global.error.exception;

import com.project.blog.global.error.code.ErrorCode;

import lombok.Getter;

@Getter
public class AuthenticationException extends RuntimeException {
    private final ErrorCode errorCode;

    public AuthenticationException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
}
