package com.project.blog.global.error.handler;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.project.blog.global.error.code.ErrorCode;
import com.project.blog.global.error.dto.ErrorResDto;
import com.project.blog.global.error.exception.AuthenticationException;
import com.project.blog.global.error.exception.BusinessException;
import com.project.blog.global.error.exception.InputBusinessException;

import lombok.extern.slf4j.Slf4j;

/**
 * Global exception handler for consistent error responses
 *
 * Exception handling hierarchy:
 * 1. handleInputValidationException - Input format validation at Controller
 * (@Valid, @Validated)
 * 2. handleInputBusinessException - Input business validation at Service
 * (DB-based checks)
 * 3. handleBusinessException - Business logic errors (resource not found, state
 * errors, etc.)
 * 4. handleAuthenticationException - Authentication errors
 * 5. handleSpringSecurityException - Spring Security errors
 * 6. handleIllegalArgumentException - External library errors
 * 7. handleException - Fallback for all uncaught exceptions
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({ BindException.class, MethodArgumentNotValidException.class })
    public ResponseEntity<ErrorResDto> handleInputValidationException(Exception e) {
        log.error("Input validation exception: {}", e.getMessage());
        ErrorCode errorCode = ErrorCode.INPUT_VALIDATION_ERROR;
        Map<String, String> errors = new LinkedHashMap<>();

        if (e instanceof MethodArgumentNotValidException) {
            ((MethodArgumentNotValidException) e).getBindingResult().getFieldErrors().stream()
                    .sorted((e1, e2) -> {
                        long priority1 = getInputValidationPriority(e1.getCode());
                        long priority2 = getInputValidationPriority(e2.getCode());
                        return Long.compare(priority1, priority2);
                    })
                    .forEach(error -> errors.putIfAbsent(error.getField(), error.getDefaultMessage()));
        }

        return buildErrorResponse(errorCode, errors);
    }

    @ExceptionHandler(InputBusinessException.class)
    public ResponseEntity<ErrorResDto> handleInputBusinessException(InputBusinessException e) {
        log.error("Input business exception: {}", e.getMessage());
        ErrorCode errorCode = e.getErrorCode();
        Map<String, String> errors = e.getErrors();

        return buildErrorResponse(errorCode, errors);
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResDto> handleBusinessException(BusinessException e) {
        log.error("Business exception: {}", e.getMessage());
        ErrorCode errorCode = e.getErrorCode();
        return buildErrorResponse(errorCode);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResDto> handleAuthenticationException(AuthenticationException e) {
        log.error("Authentication exception: {}", e.getMessage());
            ErrorCode errorCode = e.getErrorCode();
        return buildErrorResponse(errorCode);
    }

    @ExceptionHandler({ BadCredentialsException.class, UsernameNotFoundException.class })
    public ResponseEntity<ErrorResDto> handleSpringSecurityException(Exception e) {
        log.error("Spring Security exception: {}", e.getMessage());
        return buildErrorResponse(ErrorCode.INVALID_CREDENTIALS);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResDto> handleIllegalArgumentException(IllegalArgumentException e) {
        log.error("IllegalArgumentException: {}", e.getMessage());
        return buildErrorResponse(ErrorCode.INVALID_INPUT);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResDto> handleException(Exception e) {
        log.error("Unexpected exception occurred: ", e);
        return buildErrorResponse(ErrorCode.INTERNAL_SERVER_ERROR);
    }

    private long getInputValidationPriority(String code) {
        if (code == null)
            return 999;

        switch (code) {
            case "NotBlank":
                return 1;
            case "NotNull":
                return 2;
            case "NotEmpty":
                return 3;
            case "Size":
                return 4;
            case "Pattern":
                return 5;
            default:
                return 999;
        }
    }

    private ResponseEntity<ErrorResDto> buildErrorResponse(ErrorCode errorCode) {
        ErrorResDto response = ErrorResDto.of(errorCode.getCode(), errorCode.getMessage());
        return ResponseEntity.status(errorCode.getStatus()).body(response);
    }

    private ResponseEntity<ErrorResDto> buildErrorResponse(ErrorCode errorCode, Map<String, String> errors) {
        ErrorResDto response = ErrorResDto.of(errorCode.getCode(), errorCode.getMessage(), errors);
        return ResponseEntity.status(errorCode.getStatus()).body(response);
    }
}