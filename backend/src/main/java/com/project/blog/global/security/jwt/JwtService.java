package com.project.blog.global.security.jwt;

import java.util.Map;

import org.springframework.stereotype.Component;

import com.project.blog.domain.account.service.RefreshTokenService;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtService {

    private final JwtProvider jwtProvider;
    private final RefreshTokenService refreshTokenService;

    public Map<String, String> generateTokens(String username, Long accountId, String loginMethod) {
        String accessToken = jwtProvider.createAccessToken(username, loginMethod);
        String refreshToken = jwtProvider.createRefreshToken(username, loginMethod);

        long expirationSeconds = jwtProvider.getRefreshTokenExpirationSeconds();
        refreshTokenService.saveRefreshToken(accountId, refreshToken, expirationSeconds);

        return Map.of(
                "accessToken", accessToken,
                "refreshToken", refreshToken);
    }

    public Map<String, String> reissueAccessToken(String refreshToken) {
        jwtProvider.validateToken(refreshToken);
        Claims claims = jwtProvider.extractClaims(refreshToken);
        String username = claims.getSubject();
        String loginMethod = claims.get("loginMethod", String.class);

        String newAccessToken = jwtProvider.createAccessToken(username, loginMethod);

        return Map.of(
                "accessToken", newAccessToken,
                "refreshToken", refreshToken);
    }
}