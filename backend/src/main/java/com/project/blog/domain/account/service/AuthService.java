package com.project.blog.domain.account.service;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.project.blog.domain.account.dto.req.LoginReqDto;
import com.project.blog.domain.account.entity.Account;
import com.project.blog.domain.account.repository.AccountRepository;
import com.project.blog.global.error.code.ErrorCode;
import com.project.blog.global.error.exception.BusinessException;
import com.project.blog.global.security.jwt.JwtCookieUtil;
import com.project.blog.global.security.jwt.JwtProvider;
import com.project.blog.global.security.jwt.JwtService;
import com.project.blog.global.security.service.AuthenticatedUser;
import com.project.blog.global.security.service.AuthenticationService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AccountRepository accountRepository;
    private final AuthenticationService authenticationService;
    private final JwtService jwtService;
    private final JwtCookieUtil jwtCookieUtil;
    private final JwtProvider jwtProvider;
    private final RefreshTokenService refreshTokenService;

    public void login(LoginReqDto reqDto, HttpServletResponse res) {
        Account account = accountRepository.findByUsername(reqDto.getUsername())
                .orElseThrow(() -> new BusinessException(ErrorCode.ACCOUNT_NOT_FOUND));

        if (account.isDeactivated()) {
            throw new BusinessException(ErrorCode.ACCOUNT_ALREADY_DEACTIVATED);
        }

        authenticationService.authenticateWithPassword(reqDto);

        Map<String, String> tokens = jwtService.generateTokens(reqDto.getUsername(), account.getId(), "LOCAL");

        jwtCookieUtil.addTokenToCookie(res, tokens);
    }

    public void refresh(HttpServletRequest req, HttpServletResponse res) {
        String refreshToken = jwtCookieUtil.getRefreshToken(req)
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_TOKEN));

        jwtProvider.validateToken(refreshToken);
        String username = jwtProvider.extractClaims(refreshToken).getSubject();

        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException(ErrorCode.ACCOUNT_NOT_FOUND));

        refreshTokenService.validateRefreshToken(account.getId(), refreshToken);

        Map<String, String> tokens = jwtService.reissueAccessToken(refreshToken);

        jwtCookieUtil.addTokenToCookie(res, tokens);
    }

    public void logout(AuthenticatedUser authenticatedUser, HttpServletResponse res) {
        refreshTokenService.deleteRefreshToken(authenticatedUser.getAccount().getId());

        jwtCookieUtil.clearTokenFromCookie(res);
    }
}
