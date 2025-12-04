package com.project.blog.domain.account.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.project.blog.domain.account.dto.req.LoginReqDto;
import com.project.blog.domain.account.entity.Account;
import com.project.blog.domain.account.enums.LoginType;
import com.project.blog.domain.account.enums.RoleType;
import com.project.blog.domain.account.repository.AccountRepository;
import com.project.blog.global.error.code.ErrorCode;
import com.project.blog.global.error.exception.BusinessException;
import com.project.blog.global.security.jwt.JwtCookieUtil;
import com.project.blog.global.security.jwt.JwtProvider;
import com.project.blog.global.security.jwt.JwtService;
import com.project.blog.global.security.service.AuthenticatedUser;
import com.project.blog.global.security.service.AuthenticationService;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService 단위 테스트")
class AuthServiceTest {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private AuthenticationService authenticationService;

    @Mock
    private JwtService jwtService;

    @Mock
    private JwtCookieUtil jwtCookieUtil;

    @Mock
    private JwtProvider jwtProvider;

    @Mock
    private RefreshTokenService refreshTokenService;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @InjectMocks
    private AuthService authService;

    private Account testAccount;

    private LoginReqDto loginReqDto;

    @BeforeEach
    void setUp() {
        testAccount = Account.builder()
                .id(1L)
                .username("testuser")
                .password("encodedPassword")
                .email("test@example.com")
                .roleType(RoleType.USER)
                .loginType(LoginType.LOCAL)
                .build();

        loginReqDto = new LoginReqDto("testuser", "password123");
    }

    @Nested
    @DisplayName("login 메서드")
    class LoginTest {

        @Test
        @DisplayName("로그인 성공 시 RefreshToken 저장 및 쿠키 설정")
        void loginSuccess() {
            // given
            Map<String, String> tokens = Map.of(
                    "accessToken", "access.jwt.token",
                    "refreshToken", "refresh.jwt.token"
            );

            when(accountRepository.findByUsername("testuser")).thenReturn(Optional.of(testAccount));
            when(jwtService.generateTokens("testuser", 1L)).thenReturn(tokens);

            // when
            authService.login(loginReqDto, response);

            // then
            verify(accountRepository).findByUsername("testuser");
            verify(authenticationService).authenticateWithPassword(loginReqDto);
            verify(jwtService).generateTokens("testuser", 1L);
            verify(jwtCookieUtil).addTokenToCookie(response, tokens);
        }

        @Test
        @DisplayName("존재하지 않는 사용자로 로그인 시도 시 예외 발생")
        void loginWithNonExistentUser() {
            // given
            when(accountRepository.findByUsername("testuser")).thenReturn(Optional.empty());

            // when & then
            assertThatThrownBy(() -> authService.login(loginReqDto, response))
                    .isInstanceOf(BusinessException.class)
                    .hasFieldOrPropertyWithValue("errorCode", ErrorCode.ACCOUNT_NOT_FOUND);

            verify(authenticationService, times(0)).authenticateWithPassword(any());
            verify(jwtService, times(0)).generateTokens(anyString(), anyLong());
        }
    }

    @Nested
    @DisplayName("refresh 메서드")
    class RefreshTest {

        @Test
        @DisplayName("RefreshToken으로 토큰 갱신 성공")
        void refreshTokenSuccess() {
            // given
            String refreshToken = "refresh.jwt.token";
            Claims claims = org.mockito.Mockito.mock(Claims.class);
            when(claims.getSubject()).thenReturn("testuser");

            Map<String, String> newTokens = Map.of(
                    "accessToken", "new.access.token",
                    "refreshToken", "new.refresh.token"
            );

            when(jwtCookieUtil.getRefreshToken(request)).thenReturn(Optional.of(refreshToken));
            when(jwtProvider.extractClaims(refreshToken)).thenReturn(claims);
            when(accountRepository.findByUsername("testuser")).thenReturn(Optional.of(testAccount));
            when(jwtService.reissueAccessToken(refreshToken)).thenReturn(newTokens);

            // when
            authService.refresh(request, response);

            // then
            verify(jwtCookieUtil).getRefreshToken(request);
            verify(jwtProvider).validateToken(refreshToken);
            verify(jwtProvider).extractClaims(refreshToken);
            verify(accountRepository).findByUsername("testuser");
            verify(refreshTokenService).validateRefreshToken(1L, refreshToken);
            verify(jwtService).reissueAccessToken(refreshToken);
            verify(jwtCookieUtil).addTokenToCookie(response, newTokens);
        }

        @Test
        @DisplayName("RefreshToken이 쿠키에 없을 때 예외 발생")
        void refreshWithoutToken() {
            // given
            when(jwtCookieUtil.getRefreshToken(request)).thenReturn(Optional.empty());

            // when & then
            assertThatThrownBy(() -> authService.refresh(request, response))
                    .isInstanceOf(BusinessException.class)
                    .hasFieldOrPropertyWithValue("errorCode", ErrorCode.INVALID_TOKEN);

            verify(jwtProvider, times(0)).validateToken(anyString());
            verify(refreshTokenService, times(0)).validateRefreshToken(anyLong(), anyString());
        }

        @Test
        @DisplayName("RefreshToken의 사용자가 존재하지 않을 때 예외 발생")
        void refreshWithNonExistentUser() {
            // given
            String refreshToken = "refresh.jwt.token";
            Claims claims = org.mockito.Mockito.mock(Claims.class);
            when(claims.getSubject()).thenReturn("nonexistent");

            when(jwtCookieUtil.getRefreshToken(request)).thenReturn(Optional.of(refreshToken));
            when(jwtProvider.extractClaims(refreshToken)).thenReturn(claims);
            when(accountRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

            // when & then
            assertThatThrownBy(() -> authService.refresh(request, response))
                    .isInstanceOf(BusinessException.class)
                    .hasFieldOrPropertyWithValue("errorCode", ErrorCode.ACCOUNT_NOT_FOUND);

            verify(jwtProvider).validateToken(refreshToken);
            verify(refreshTokenService, times(0)).validateRefreshToken(anyLong(), anyString());
        }
    }

    @Nested
    @DisplayName("logout 메서드")
    class LogoutTest {

        @Test
        @DisplayName("로그아웃 시 RefreshToken 삭제 및 쿠키 삭제")
        void logoutSuccess() {
            // given
            AuthenticatedUser authenticatedUser = new AuthenticatedUser(testAccount);

            // when
            authService.logout(authenticatedUser, response);

            // then
            verify(refreshTokenService).deleteRefreshToken(1L);
            verify(jwtCookieUtil).clearTokenFromCookie(response);
        }
    }
}
