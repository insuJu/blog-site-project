package com.project.blog.global.security.oauth2.handler;

import java.io.IOException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.project.blog.global.security.jwt.JwtCookieUtil;
import com.project.blog.global.security.jwt.JwtService;
import com.project.blog.global.security.oauth2.service.CustomOAuth2User;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final JwtCookieUtil jwtCookieUtil;

    @Value("${app.oauth2.redirect-uri}")
    private String frontendRedirectUri;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {

        CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();

        String username = oAuth2User.getUsername();
        Long accountId = oAuth2User.getId();
        boolean isNewUser = oAuth2User.isNewUser();

        Map<String, String> tokens = jwtService.generateTokens(username, accountId, "OAUTH2");

        jwtCookieUtil.addTokenToCookie(response, tokens);

        String redirectUrl = isNewUser
            ? frontendRedirectUri + "?newUser=true"
            : frontendRedirectUri;

        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
