package com.project.blog.domain.account.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.project.blog.domain.account.entity.Account;
import com.project.blog.domain.account.entity.RefreshToken;
import com.project.blog.domain.account.enums.LoginType;
import com.project.blog.domain.account.enums.RoleType;
import com.project.blog.domain.account.repository.AccountRepository;
import com.project.blog.domain.account.repository.RefreshTokenRepository;
import com.project.blog.global.error.code.ErrorCode;
import com.project.blog.global.error.exception.AuthenticationException;
import com.project.blog.global.error.exception.BusinessException;

@ExtendWith(MockitoExtension.class)
@DisplayName("RefreshTokenService 단위 테스트")
class RefreshTokenServiceTest {

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private AccountRepository accountRepository;

    @InjectMocks
    private RefreshTokenService refreshTokenService;

    private Account testAccount;
    private String testToken;
    private LocalDateTime testExpiresAt;

    @BeforeEach
    void setUp() {
        testAccount = Account.builder()
                .id(1)
                .username("testuser")
                .password("encodedPassword")
                .email("test@example.com")
                .roleType(RoleType.USER)
                .loginType(LoginType.LOCAL)
                .build();

        testToken = "test.jwt.token";
        testExpiresAt = LocalDateTime.now().plusDays(7);
    }

    @Nested
    @DisplayName("saveRefreshToken 메서드")
    class SaveRefreshTokenTest {

        @Test
        @DisplayName("새로운 RefreshToken 저장 성공")
        void saveNewRefreshToken() {
            // given
            when(accountRepository.findById(1)).thenReturn(Optional.of(testAccount));
            when(refreshTokenRepository.findById(1)).thenReturn(Optional.empty());

            // when
            refreshTokenService.saveRefreshToken(1, testToken, testExpiresAt);

            // then
            verify(refreshTokenRepository).findById(1);
            verify(refreshTokenRepository, never()).delete(any());

            ArgumentCaptor<RefreshToken> captor = ArgumentCaptor.forClass(RefreshToken.class);
            verify(refreshTokenRepository).save(captor.capture());

            RefreshToken savedToken = captor.getValue();
            assertThat(savedToken.getAccountId()).isEqualTo(1);
            assertThat(savedToken.getAccount()).isEqualTo(testAccount);
            assertThat(savedToken.getTokenHash()).isNotNull();
            assertThat(savedToken.getExpiresAt()).isEqualTo(testExpiresAt);
        }

        @Test
        @DisplayName("기존 RefreshToken 삭제 및 새로운 RefreshToken 저장 성공")
        void saveRefreshTokenWhenTokenAlreadyExists() {
            // given
            RefreshToken existingToken = RefreshToken.builder()
                    .accountId(1)
                    .account(testAccount)
                    .tokenHash("oldHash")
                    .expiresAt(LocalDateTime.now().plusDays(1))
                    .build();

            when(accountRepository.findById(1)).thenReturn(Optional.of(testAccount));
            when(refreshTokenRepository.findById(1)).thenReturn(Optional.of(existingToken));

            // when
            refreshTokenService.saveRefreshToken(1, testToken, testExpiresAt);

            // then
            verify(refreshTokenRepository).findById(1);
            verify(refreshTokenRepository).delete(existingToken);

            ArgumentCaptor<RefreshToken> captor = ArgumentCaptor.forClass(RefreshToken.class);
            verify(refreshTokenRepository).save(captor.capture());

            RefreshToken savedToken = captor.getValue();
            assertThat(savedToken.getAccountId()).isEqualTo(1);
            assertThat(savedToken.getAccount()).isEqualTo(testAccount);
            assertThat(savedToken.getTokenHash()).isNotNull();
            assertThat(savedToken.getExpiresAt()).isEqualTo(testExpiresAt);
        }

        @Test
        @DisplayName("존재하지 않는 Account ID로 저장 시도 시 예외 발생")
        void saveWithNonExistentAccount() {
            // given
            when(accountRepository.findById(1)).thenReturn(Optional.empty());

            // when & then
            assertThatThrownBy(() -> refreshTokenService.saveRefreshToken(1, testToken, testExpiresAt))
                    .isInstanceOf(BusinessException.class)
                    .hasFieldOrPropertyWithValue("errorCode", ErrorCode.ACCOUNT_NOT_FOUND);

            verify(refreshTokenRepository, never()).findById(any());
            verify(refreshTokenRepository, never()).delete(any());
            verify(refreshTokenRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("validateRefreshToken 메서드")
    class ValidateRefreshTokenTest {

        @Test
        @DisplayName("유효한 RefreshToken 검증 성공")
        void validateValidToken() {
            // given
            RefreshToken validToken = RefreshToken.builder()
                    .accountId(1)
                    .account(testAccount)
                    .tokenHash(hashToken(testToken))
                    .expiresAt(LocalDateTime.now().plusDays(7))
                    .build();

            when(refreshTokenRepository.findById(1)).thenReturn(Optional.of(validToken));

            // when & then
            refreshTokenService.validateRefreshToken(1, testToken);
        }

        @Test
        @DisplayName("존재하지 않는 RefreshToken 검증 시 예외 발생")
        void validateNonExistentToken() {
            // given
            when(refreshTokenRepository.findById(1)).thenReturn(Optional.empty());

            // when & then
            assertThatThrownBy(() -> refreshTokenService.validateRefreshToken(1, testToken))
                    .isInstanceOf(AuthenticationException.class)
                    .hasFieldOrPropertyWithValue("errorCode", ErrorCode.INVALID_REFRESH_TOKEN);
        }

        @Test
        @DisplayName("잘못된 토큰 해시로 검증 시 예외 발생")
        void validateInvalidTokenHash() {
            // given
            RefreshToken invalidToken = RefreshToken.builder()
                    .accountId(1)
                    .account(testAccount)
                    .tokenHash("wrongHash")
                    .expiresAt(LocalDateTime.now().plusDays(7))
                    .build();

            when(refreshTokenRepository.findById(1)).thenReturn(Optional.of(invalidToken));

            // when & then
            assertThatThrownBy(() -> refreshTokenService.validateRefreshToken(1, testToken))
                    .isInstanceOf(AuthenticationException.class)
                    .hasFieldOrPropertyWithValue("errorCode", ErrorCode.INVALID_REFRESH_TOKEN);
        }

        @Test
        @DisplayName("만료된 토큰 검증 시 예외 발생")
        void validateExpiredToken() {
            // given
            RefreshToken expiredToken = RefreshToken.builder()
                    .accountId(1)
                    .account(testAccount)
                    .tokenHash(hashToken(testToken))
                    .expiresAt(LocalDateTime.now().minusDays(1))
                    .build();

            when(refreshTokenRepository.findById(1)).thenReturn(Optional.of(expiredToken));

            // when & then
            assertThatThrownBy(() -> refreshTokenService.validateRefreshToken(1, testToken))
                    .isInstanceOf(AuthenticationException.class)
                    .hasFieldOrPropertyWithValue("errorCode", ErrorCode.EXPIRED_REFRESH_TOKEN);
        }
    }

    @Nested
    @DisplayName("deleteRefreshToken 메서드")
    class DeleteRefreshTokenTest {

        @Test
        @DisplayName("RefreshToken 삭제 성공")
        void deleteToken() {
            // when
            refreshTokenService.deleteRefreshToken(1);

            // then
            verify(refreshTokenRepository).deleteById(1);
        }
    }

    private String hashToken(String token) {
        try {
            java.security.MessageDigest digest = java.security.MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            return java.util.Base64.getEncoder().encodeToString(hash);
        } catch (java.security.NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }
}
