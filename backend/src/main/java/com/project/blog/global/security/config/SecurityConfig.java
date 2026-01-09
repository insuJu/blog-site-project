package com.project.blog.global.security.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.CorsFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.blog.global.security.filter.JwtAuthenticationFilter;
import com.project.blog.global.security.jwt.JwtCookieUtil;
import com.project.blog.global.security.jwt.JwtProvider;
import com.project.blog.global.security.oauth2.handler.OAuth2AuthenticationFailureHandler;
import com.project.blog.global.security.oauth2.handler.OAuth2AuthenticationSuccessHandler;
import com.project.blog.global.security.oauth2.service.CustomOAuth2UserService;
import com.project.blog.global.security.service.AuthenticationService;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

        private final ObjectMapper objectMapper;
        private final AuthenticationService authenticationService;
        private final JwtCookieUtil jwtCookieUtil;
        private final JwtProvider jwtProvider;
        private final CorsFilter corsFilter;
        private final CustomOAuth2UserService customOAuth2UserService;
        private final OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;
        private final OAuth2AuthenticationFailureHandler oAuth2AuthenticationFailureHandler;

        @Bean
        SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .csrf(AbstractHttpConfigurer::disable)
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .formLogin(AbstractHttpConfigurer::disable)
                                .httpBasic(AbstractHttpConfigurer::disable)
                                .addFilterBefore(corsFilter, UsernamePasswordAuthenticationFilter.class)
                                .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
                                .oauth2Login(oauth2 -> oauth2
                                                .userInfoEndpoint(userInfo -> userInfo
                                                                .userService(customOAuth2UserService))
                                                .successHandler(oAuth2AuthenticationSuccessHandler)
                                                .failureHandler(oAuth2AuthenticationFailureHandler))
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                                                .requestMatchers("/api/users/signup/**",
                                                                "/api/users/{userId}",
                                                                "/api/auth/login",
                                                                "/api/auth/refresh")
                                                .permitAll()
                                                .requestMatchers("/api/users/find-username",
                                                                "/api/users/password-reset/**")
                                                .permitAll()
                                                .requestMatchers("/oauth2/**", "/login/oauth2/**").permitAll()
                                                .requestMatchers("/uploads/**").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/posts/**").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/tags/**").permitAll()
                                                .anyRequest().authenticated());

                return http.build();
        }

        @Bean
        JwtAuthenticationFilter jwtAuthenticationFilter() {
                return JwtAuthenticationFilter.builder()
                                .authenticationService(authenticationService)
                                .jwtCookieUtil(jwtCookieUtil)
                                .objectMapper(objectMapper)
                                .jwtProvider(jwtProvider)
                                .build();
        }

        @Bean
        AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
                        throws Exception {
                return authenticationConfiguration.getAuthenticationManager();
        }
}
