package com.project.blog.global.error.dto;

import java.time.LocalDateTime;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResDto {
    private final String code;
    private final String message;
    private final LocalDateTime timestamp;
    private final Map<String, String> errors;

    public static ErrorResDto of(String code, String message) {
        return ErrorResDto.builder()
                .code(code)
                .message(message)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static ErrorResDto of(String code, String message, Map<String, String> errors) {
        return ErrorResDto.builder()
                .code(code)
                .message(message)
                .timestamp(LocalDateTime.now())
                .errors(errors)
                .build();
    }
}
