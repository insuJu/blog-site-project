package com.project.blog.global.security.filter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.blog.global.error.code.ErrorCode;
import com.project.blog.global.error.dto.ErrorResDto;
import com.project.blog.global.error.exception.AuthenticationException;
import com.project.blog.global.security.jwt.JwtCookieUtil;
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
    private final JwtCookieUtil jwtCookieUtil;
    private final JwtProvider jwtProvider;
    private final ObjectMapper objectMapper;

    private static final List<String> EXCLUDED_PATHS = List.of(
            "/api/auth/refresh");

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return EXCLUDED_PATHS.contains(path);
    }

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
        Optional<String> accessToken = jwtCookieUtil.getAccessToken(req);

        if (accessToken.isPresent()) {
            String token = accessToken.get();
            jwtProvider.validateToken(token);
            authenticationService.authenticateWithJwt(token);
            return;
        }

        Optional<String> refreshToken = jwtCookieUtil.getRefreshToken(req);
        if (refreshToken.isPresent()) {
            throw new AuthenticationException(ErrorCode.EXPIRED_TOKEN);
        }
    }

    private void handleAuthenticationException(
            HttpServletResponse res,
            AuthenticationException e) throws IOException {
        writeErrorResponse(res, e.getErrorCode());
    }

    private void handleBadCredentialsException(HttpServletResponse res) throws IOException {
        jwtCookieUtil.clearTokenFromCookie(res);
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