package com.project.blog.global.security.filter;

import java.io.IOException;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.blog.global.error.code.ErrorCode;
import com.project.blog.global.error.dto.ErrorResDto;
import com.project.blog.global.error.exception.AuthenticationException;
import com.project.blog.global.security.jwt.JwtCookieService;
import com.project.blog.global.security.jwt.JwtProvider;
import com.project.blog.global.security.service.AuthenticationService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Builder;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Builder
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final AuthenticationService authenticationService;
    private final JwtCookieService jwtCookieService;
    private final JwtProvider jwtProvider;
    private final ObjectMapper objectMapper;

    @Override
    protected void doFilterInternal(
            HttpServletRequest req,
            HttpServletResponse res,
            FilterChain chain) throws IOException, ServletException {
        try {
            processAuthentication(req);
            chain.doFilter(req, res);
        } catch (AuthenticationException e) {
            handleAuthenticationException(res, e);
        } catch (BadCredentialsException e) {
            handleBadCredentialsException(res);
        } finally {
            SecurityContextHolder.clearContext();
        }
    }

    private void processAuthentication(HttpServletRequest req) {
        jwtCookieService.getAccessToken(req)
                .ifPresent(token -> {
                    jwtProvider.validateToken(token);
                    authenticationService.authenticateWithJwt(token);
                });
    }

    private void handleAuthenticationException(
            HttpServletResponse res,
            AuthenticationException e) throws IOException {
        writeErrorResponse(res, e.getErrorCode());
    }

    private void handleBadCredentialsException(HttpServletResponse res) throws IOException {
        jwtCookieService.clearTokenFromCookie(res);
        writeErrorResponse(res, ErrorCode.INVALID_CREDENTIALS);
    }

    private void writeErrorResponse(HttpServletResponse res, ErrorCode errorCode) throws IOException {
        ErrorResDto errorResponse = ErrorResDto.of(
                errorCode.getCode(),
                errorCode.getMessage());

        res.setStatus(errorCode.getStatus().value());
        res.setContentType("application/json;charset=UTF-8");
        res.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }
}