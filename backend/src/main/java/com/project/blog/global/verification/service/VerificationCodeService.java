package com.project.blog.global.verification.service;

import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.project.blog.global.error.code.ErrorCode;
import com.project.blog.global.error.util.ErrorUtil;
import com.project.blog.global.verification.enums.VerificationType;
import com.project.blog.global.verification.repository.VerificationCodeRedisRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VerificationCodeService {

    private final VerificationCodeRedisRepository verificationCodeRepository;
    private final SecureRandom random = new SecureRandom();

    public String generateCode() {
        return String.format("%06d", random.nextInt(1000000));
    }

    public void saveCode(String identifier, VerificationType type, String code) {
        verificationCodeRepository.save(identifier, type, code);
    }

    public void validateCode(String identifier, VerificationType type, String code) {
        Map<String, String> errors = new HashMap<>();

        String savedCode = verificationCodeRepository.findByIdentifierAndType(identifier, type)
                .orElse(null);

        ErrorUtil.addErrorIf(errors, savedCode == null, "verificationCode",
                () -> ErrorCode.VERIFICATION_CODE_EXPIRED.getMessage());
        ErrorUtil.addErrorIf(errors, savedCode != null && !savedCode.equals(code), "verificationCode",
                () -> ErrorCode.INVALID_VERIFICATION_CODE.getMessage());

        ErrorUtil.throwIfNotEmpty(errors);

        verificationCodeRepository.deleteByIdentifierAndType(identifier, type);
    }
}
