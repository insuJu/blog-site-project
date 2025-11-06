package com.project.blog.global.security.jwt;

import java.util.Map;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtService {

    private final JwtProvider jwtProvider;

    public Map<String, String> generateTokens(String username) {
        String accessToken = jwtProvider.createAccessToken(username);
        String refreshToken = jwtProvider.createRefreshToken(username);

        return Map.of(
                "accessToken", accessToken,
                "refreshToken", refreshToken);
    }

    public Map<String, String> refreshTokens(String refreshToken) {
        jwtProvider.validateToken(refreshToken);
        String username = jwtProvider.extractClaims(refreshToken).getSubject();

        String newAccessToken = jwtProvider.createAccessToken(username);

        return Map.of(
                "accessToken", newAccessToken,
                "refreshToken", refreshToken);  
    }
}