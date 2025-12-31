package com.project.blog.global.security.service;

import org.apache.commons.lang3.StringUtils;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.project.blog.domain.account.dto.req.LoginReqDto;
import com.project.blog.global.error.code.ErrorCode;
import com.project.blog.global.error.exception.AuthenticationException;
import com.project.blog.global.security.jwt.JwtProvider;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AuthenticationService {

    private final AuthenticatedUserService authenticatedUserService;
    private final JwtProvider jwtProvider;
    private final BCryptPasswordEncoder passwordEncoder;

    public void authenticateWithPassword(LoginReqDto reqDto) {
        AuthenticatedUser authenticatedUser = authenticatedUserService.loadUserByUsername(reqDto.getUsername());

        if (!passwordEncoder.matches(reqDto.getPassword(), authenticatedUser.getPassword())) {
            throw new AuthenticationException(ErrorCode.INVALID_CREDENTIALS);
        }

        registerAuthentication(authenticatedUser);
    }

    public void authenticateWithJwt(String token) {
        Claims claims = jwtProvider.extractClaims(token);
        String username = claims.getSubject();
        if (StringUtils.isBlank(username)) {
            throw new AuthenticationException(ErrorCode.INVALID_TOKEN);
        }

        String loginMethod = claims.get("loginMethod", String.class);
        if (loginMethod == null) {
            loginMethod = "LOCAL";
        }

        AuthenticatedUser authenticatedUser = authenticatedUserService.loadUserByUsername(username, loginMethod);
        registerAuthentication(authenticatedUser);
    }

    private void registerAuthentication(AuthenticatedUser authenticatedUser) {
        Authentication auth = new UsernamePasswordAuthenticationToken(
                authenticatedUser,
                null,
                authenticatedUser.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);
    }
}
