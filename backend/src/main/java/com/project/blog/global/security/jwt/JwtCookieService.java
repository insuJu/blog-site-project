package com.project.blog.global.security.jwt;

import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Arrays;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtCookieService {
    private static final String ACCESS_TOKEN_NAME = "accessToken";
    private static final String REFRESH_TOKEN_NAME = "refreshToken";

    @Value("${jwt.access.expiration.seconds}")
    private long accessTokenExpirationSeconds;

    @Value("${jwt.refresh.expiration.seconds}")
    private long refreshTokenExpirationSeconds;

    public Optional<String> getAccessToken(HttpServletRequest req) {
        return getTokenFromCookie(req, ACCESS_TOKEN_NAME);
    }

    public Optional<String> getRefreshToken(HttpServletRequest req) {
        return getTokenFromCookie(req, REFRESH_TOKEN_NAME);
    }

    private Optional<String> getTokenFromCookie(HttpServletRequest req, String tokenName) {
        return Optional.ofNullable(req.getCookies())
                .flatMap(cookies -> Arrays.stream(cookies)
                        .filter(c -> tokenName.equals(c.getName()))
                        .findFirst()
                        .map(c -> URLDecoder.decode(c.getValue(), StandardCharsets.UTF_8)));
    }

    public void addTokenToCookie(HttpServletResponse res, Map<String, String> tokens) {
        res.addHeader("Set-Cookie",
                createCookie(ACCESS_TOKEN_NAME, tokens.get(ACCESS_TOKEN_NAME), accessTokenExpirationSeconds));
        res.addHeader("Set-Cookie",
                createCookie(REFRESH_TOKEN_NAME, tokens.get(REFRESH_TOKEN_NAME), refreshTokenExpirationSeconds));
    }

    public void clearTokenFromCookie(HttpServletResponse res) {
        res.addHeader("Set-Cookie",
                createCookie(ACCESS_TOKEN_NAME, "", 0));
        res.addHeader("Set-Cookie",
                createCookie(REFRESH_TOKEN_NAME, "", 0));
    }

    private String createCookie(String name, String value, long maxAge) {
        return ResponseCookie.from(name, URLEncoder.encode(value, StandardCharsets.UTF_8))
                .path("/")
                .maxAge(Duration.ofSeconds(maxAge))
                .httpOnly(true)
                .sameSite("Strict")
                .build()
                .toString();
    }
}
