package com.project.blog.global.error.exception;

import java.util.Map;

import com.project.blog.global.error.code.ErrorCode;

import lombok.Getter;

@Getter
public class InputBusinessException extends RuntimeException {
    private final ErrorCode errorCode;
    private final Map<String, String> errors;

    public InputBusinessException(ErrorCode errorCode, Map<String, String> errors) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
        this.errors = errors;
    }
}
