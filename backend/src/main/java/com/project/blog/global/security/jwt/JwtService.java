package com.project.blog.global.security.jwt;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.project.blog.domain.account.service.RefreshTokenService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtService {

    private final JwtProvider jwtProvider;
    private final RefreshTokenService refreshTokenService;

    public Map<String, String> generateTokens(String username, Long accountId) {
        String accessToken = jwtProvider.createAccessToken(username);
        String refreshToken = jwtProvider.createRefreshToken(username);

        LocalDateTime expiresAt = LocalDateTime.now()
                .plusSeconds(jwtProvider.getRefreshTokenExpirationSeconds());
        refreshTokenService.saveRefreshToken(accountId, refreshToken, expiresAt);

        return Map.of(
                "accessToken", accessToken,
                "refreshToken", refreshToken);
    }

    public Map<String, String> reissueAccessToken(String refreshToken) {
        jwtProvider.validateToken(refreshToken);
        String username = jwtProvider.extractClaims(refreshToken).getSubject();

        String newAccessToken = jwtProvider.createAccessToken(username);

        return Map.of(
                "accessToken", newAccessToken,
                "refreshToken", refreshToken);
    }
}