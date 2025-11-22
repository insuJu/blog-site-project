package com.project.blog.domain.account.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Base64;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.blog.domain.account.entity.Account;
import com.project.blog.domain.account.entity.RefreshToken;
import com.project.blog.domain.account.repository.AccountRepository;
import com.project.blog.domain.account.repository.RefreshTokenRepository;
import com.project.blog.global.error.code.ErrorCode;
import com.project.blog.global.error.exception.AuthenticationException;
import com.project.blog.global.error.exception.BusinessException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final AccountRepository accountRepository;

    @Transactional
    public void saveRefreshToken(int accountId, String token, LocalDateTime expiresAt) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new BusinessException(ErrorCode.ACCOUNT_NOT_FOUND));

        String tokenHash = hashToken(token);

        refreshTokenRepository.findById(accountId)
                .ifPresent(refreshTokenRepository::delete);

        RefreshToken refreshToken = RefreshToken.builder()
                .account(account)
                .tokenHash(tokenHash)
                .expiresAt(expiresAt)
                .build();
        refreshTokenRepository.save(refreshToken);
    }

    public void validateRefreshToken(int accountId, String token) {
        String tokenHash = hashToken(token);

        RefreshToken refreshToken = refreshTokenRepository.findById(accountId)
                .orElseThrow(() -> new AuthenticationException(ErrorCode.INVALID_REFRESH_TOKEN));

        if (!refreshToken.getTokenHash().equals(tokenHash)) {
            throw new AuthenticationException(ErrorCode.INVALID_REFRESH_TOKEN);
        }

        if (refreshToken.isExpired()) {
            throw new AuthenticationException(ErrorCode.EXPIRED_REFRESH_TOKEN);
        }
    }

    @Transactional
    public void deleteRefreshToken(int accountId) {
        refreshTokenRepository.deleteById(accountId);
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
