package com.project.blog.global.exception;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ErrorResDto {
    private final String code;
    private final String message;
    private final LocalDateTime timestamp;

    public static ErrorResDto of(String code, String message) {
        return ErrorResDto.builder()
                .code(code)
                .message(message)
                .timestamp(LocalDateTime.now())
                .build();
    }
}
