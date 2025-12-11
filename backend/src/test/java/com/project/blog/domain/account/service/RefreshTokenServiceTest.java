package com.project.blog.domain.account.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

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

import com.project.blog.domain.account.repository.RefreshTokenRedisRepository;
import com.project.blog.global.error.code.ErrorCode;
import com.project.blog.global.error.exception.AuthenticationException;

@ExtendWith(MockitoExtension.class)
@DisplayName("RefreshTokenService 단위 테스트")
class RefreshTokenServiceTest {

    @Mock
    private RefreshTokenRedisRepository refreshTokenRedisRepository;

    @InjectMocks
    private RefreshTokenService refreshTokenService;

    private String testToken;
    private long testExpirationSeconds;

    @BeforeEach
    void setUp() {
        testToken = "test.jwt.token";
        testExpirationSeconds = 1209600L;
    }

    @Nested
    @DisplayName("saveRefreshToken 메서드")
    class SaveRefreshTokenTest {

        @Test
        @DisplayName("RefreshToken 저장 성공")
        void saveRefreshToken() {
            // when
            refreshTokenService.saveRefreshToken(1L, testToken, testExpirationSeconds);

            // then
            ArgumentCaptor<Long> accountIdCaptor = ArgumentCaptor.forClass(Long.class);
            ArgumentCaptor<String> hashCaptor = ArgumentCaptor.forClass(String.class);
            ArgumentCaptor<Long> expirationCaptor = ArgumentCaptor.forClass(Long.class);

            verify(refreshTokenRedisRepository).save(
                    accountIdCaptor.capture(),
                    hashCaptor.capture(),
                    expirationCaptor.capture()
            );

            assertThat(accountIdCaptor.getValue()).isEqualTo(1L);
            assertThat(hashCaptor.getValue()).isNotNull();
            assertThat(expirationCaptor.getValue()).isEqualTo(testExpirationSeconds);
        }

        @Test
        @DisplayName("기존 RefreshToken 덮어쓰기 성공")
        void saveRefreshTokenOverwrite() {
            // when
            refreshTokenService.saveRefreshToken(1L, testToken, testExpirationSeconds);

            // then
            verify(refreshTokenRedisRepository).save(eq(1L), anyString(), eq(testExpirationSeconds));
        }
    }

    @Nested
    @DisplayName("validateRefreshToken 메서드")
    class ValidateRefreshTokenTest {

        @Test
        @DisplayName("유효한 RefreshToken 검증 성공")
        void validateValidToken() {
            // given
            String tokenHash = hashToken(testToken);
            when(refreshTokenRedisRepository.findByAccountId(1L))
                    .thenReturn(Optional.of(tokenHash));

            // when & then
            refreshTokenService.validateRefreshToken(1L, testToken);
            verify(refreshTokenRedisRepository).findByAccountId(1L);
        }

        @Test
        @DisplayName("존재하지 않는 RefreshToken 검증 시 예외 발생")
        void validateNonExistentToken() {
            // given
            when(refreshTokenRedisRepository.findByAccountId(1L))
                    .thenReturn(Optional.empty());

            // when & then
            assertThatThrownBy(() -> refreshTokenService.validateRefreshToken(1L, testToken))
                    .isInstanceOf(AuthenticationException.class)
                    .hasFieldOrPropertyWithValue("errorCode", ErrorCode.INVALID_REFRESH_TOKEN);
        }

        @Test
        @DisplayName("잘못된 토큰 해시로 검증 시 예외 발생")
        void validateInvalidTokenHash() {
            // given
            when(refreshTokenRedisRepository.findByAccountId(1L))
                    .thenReturn(Optional.of("wrongHash"));

            // when & then
            assertThatThrownBy(() -> refreshTokenService.validateRefreshToken(1L, testToken))
                    .isInstanceOf(AuthenticationException.class)
                    .hasFieldOrPropertyWithValue("errorCode", ErrorCode.INVALID_REFRESH_TOKEN);
        }
    }

    @Nested
    @DisplayName("deleteRefreshToken 메서드")
    class DeleteRefreshTokenTest {

        @Test
        @DisplayName("RefreshToken 삭제 성공")
        void deleteToken() {
            // when
            refreshTokenService.deleteRefreshToken(1L);

            // then
            verify(refreshTokenRedisRepository).deleteByAccountId(1L);
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
