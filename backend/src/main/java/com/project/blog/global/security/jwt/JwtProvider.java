package com.project.blog.global.security.jwt;

import java.security.Key;
import java.util.Base64;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.project.blog.global.error.code.ErrorCode;
import com.project.blog.global.error.exception.AuthenticationException;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtProvider {

    @Value("${jwt.access.expiration.seconds}")
    private long accessTokenExpirationSeconds;

    @Value("${jwt.refresh.expiration.seconds}")
    private long refreshTokenExpirationSeconds;

    @Value("${jwt.secret.key}")
    private String secretKey;

    private Key key;

    @PostConstruct
    public void init() {
        byte[] bytes = Base64.getDecoder().decode(secretKey);
        key = Keys.hmacShaKeyFor(bytes);
    }

    public String createAccessToken(String username) {
        return createToken(username, accessTokenExpirationSeconds);
    }

    public String createRefreshToken(String username) {
        return createToken(username, refreshTokenExpirationSeconds);
    }

    private String createToken(String username, long expirationSeconds) {
        Date now = new Date();
        Date expirationTime = new Date(now.getTime() + expirationSeconds * 1000);

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expirationTime)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public void validateToken(String token) {
        try {
            parseToken(token);
        } catch (JwtException | IllegalArgumentException e) {
            throw new AuthenticationException(ErrorCode.INVALID_TOKEN);
        }
    }

    private void parseToken(String token) {
        Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token);
    }

    public Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}