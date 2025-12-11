package com.project.blog.domain.account.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

import org.springframework.stereotype.Service;

import com.project.blog.domain.account.repository.RefreshTokenRedisRepository;
import com.project.blog.global.error.code.ErrorCode;
import com.project.blog.global.error.exception.AuthenticationException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRedisRepository refreshTokenRedisRepository;

    public void saveRefreshToken(Long accountId, String token, long expirationSeconds) {
        String tokenHash = hashToken(token);
        refreshTokenRedisRepository.save(accountId, tokenHash, expirationSeconds);
    }

    public void validateRefreshToken(Long accountId, String token) {
        String tokenHash = hashToken(token);

        String storedHash = refreshTokenRedisRepository.findByAccountId(accountId)
                .orElseThrow(() -> new AuthenticationException(ErrorCode.INVALID_REFRESH_TOKEN));

        if (!storedHash.equals(tokenHash)) {
            throw new AuthenticationException(ErrorCode.INVALID_REFRESH_TOKEN);
        }
    }

    public void deleteRefreshToken(Long accountId) {
        refreshTokenRedisRepository.deleteByAccountId(accountId);
    }

    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("토큰 해싱 실패", e);
        }
    }
}
