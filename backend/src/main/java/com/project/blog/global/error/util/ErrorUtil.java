package com.project.blog.global.error.util;

import java.util.Map;
import java.util.function.Supplier;

import com.project.blog.global.error.code.ErrorCode;
import com.project.blog.global.error.exception.InputBusinessException;

public class ErrorUtil {

    public static void addErrorIf(Map<String, String> errors, boolean condition, String key, Supplier<String> messageSupplier) {
        if (condition) {
            errors.put(key, messageSupplier.get());
        }
    }

    public static void throwIfNotEmpty(Map<String, String> errors) {
        if (!errors.isEmpty()) {
            throw new InputBusinessException(ErrorCode.INPUT_BUSINESS_ERROR, errors);
        }
    }
}