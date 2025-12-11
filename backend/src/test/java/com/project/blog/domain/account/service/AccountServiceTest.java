package com.project.blog.domain.account.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.project.blog.domain.account.dto.req.EmailUpdateReqDto;
import com.project.blog.domain.account.dto.req.PasswordUpdateReqDto;
import com.project.blog.domain.account.dto.req.SignupReqDto;
import com.project.blog.domain.account.dto.res.UserInfoResDto;
import com.project.blog.domain.account.entity.Account;
import com.project.blog.domain.account.enums.LoginType;
import com.project.blog.domain.account.enums.RoleType;
import com.project.blog.domain.account.repository.AccountRepository;
import com.project.blog.domain.profile.entity.Profile;
import com.project.blog.domain.profile.service.ProfileService;
import com.project.blog.global.error.code.ErrorCode;
import com.project.blog.global.error.exception.InputBusinessException;
import com.project.blog.global.security.service.AuthenticatedUser;

@ExtendWith(MockitoExtension.class)
@DisplayName("AccountService 단위 테스트")
class AccountServiceTest {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @Mock
    private ProfileService profileService;

    @InjectMocks
    private AccountService accountService;

    private Account testAccount;

    private Profile testProfile;

    private AuthenticatedUser authenticatedUser;

    private static final String TEST_USERNAME = "testuser";
    private static final String TEST_EMAIL = "test@example.com";
    private static final String TEST_NICKNAME = "testuser";
    private static final String TEST_PASSWORD = "password123!";
    private static final String ENCODED_PASSWORD = "encodedPassword";

    @BeforeEach
    void setUp() {
        testProfile = Profile.builder()
                .id(1L)
                .nickname(TEST_NICKNAME)
                .blogName(TEST_NICKNAME + "의 블로그")
                .build();

        testAccount = Account.builder()
                .id(1L)
                .username(TEST_USERNAME)
                .password(ENCODED_PASSWORD)
                .email(TEST_EMAIL)
                .roleType(RoleType.USER)
                .loginType(LoginType.LOCAL)
                .profile(testProfile)
                .build();

        authenticatedUser = new AuthenticatedUser(testAccount);
    }

    @Nested
    @DisplayName("getUserInfo 메서드")
    class GetUserInfoTest {

        @Test
        @DisplayName("사용자 정보 조회 성공")
        void getUserInfoSuccess() {
            // when
            UserInfoResDto result = accountService.getUserInfo(authenticatedUser);

            // then
            assertThat(result).isNotNull();
            assertThat(result.getUsername()).isEqualTo(TEST_USERNAME);
            assertThat(result.getEmail()).isEqualTo(TEST_EMAIL);
            assertThat(result.getRoleType()).isEqualTo(RoleType.USER);
            assertThat(result.getLoginType()).isEqualTo(LoginType.LOCAL);
            assertThat(result.getProfile()).isNotNull();
            assertThat(result.getProfile().getNickname()).isEqualTo(TEST_NICKNAME);
            assertThat(result.getProfile().getBlogName()).isEqualTo(TEST_NICKNAME + "의 블로그");
        }
    }

    @Nested
    @DisplayName("signup 메서드")
    class SignupTest {

        @Test
        @DisplayName("회원가입 성공")
        void signupSuccess() {
            // given
            SignupReqDto reqDto = new SignupReqDto("newuser", "newpassword123!", "new@example.com", "newnick");
            Profile newProfile = Profile.builder()
                    .id(2L)
                    .nickname("newnick")
                    .blogName("newnick의 블로그")
                    .build();

            when(accountRepository.existsByUsername("newuser")).thenReturn(false);
            when(accountRepository.existsByEmail("new@example.com")).thenReturn(false);
            when(profileService.createProfile("newnick")).thenReturn(newProfile);
            when(passwordEncoder.encode("newpassword123!")).thenReturn("encodedNewPassword");

            // when
            accountService.signup(reqDto);

            // then
            verify(accountRepository).existsByUsername("newuser");
            verify(accountRepository).existsByEmail("new@example.com");
            verify(profileService).createProfile("newnick");
            verify(passwordEncoder).encode("newpassword123!");
            verify(accountRepository).save(any(Account.class));
        }

        @Test
        @DisplayName("중복된 사용자명으로 회원가입 시 예외 발생")
        void signupWithDuplicateUsername() {
            // given
            SignupReqDto reqDto = new SignupReqDto(TEST_USERNAME, "password123!", "new@example.com", "newnick");

            when(accountRepository.existsByUsername(TEST_USERNAME)).thenReturn(true);

            // when & then
            assertThatThrownBy(() -> accountService.signup(reqDto))
                    .isInstanceOf(InputBusinessException.class)
                    .satisfies(ex -> {
                        InputBusinessException exception = (InputBusinessException) ex;
                        assertThat(exception.getErrors()).containsEntry("username",
                                ErrorCode.DUPLICATE_USERNAME.getMessage());
                    });

            verify(accountRepository).existsByUsername(TEST_USERNAME);
        }

        @Test
        @DisplayName("중복된 이메일로 회원가입 시 예외 발생")
        void signupWithDuplicateEmail() {
            // given
            SignupReqDto reqDto = new SignupReqDto("newuser", "password123!", TEST_EMAIL, "newnick");

            when(accountRepository.existsByUsername("newuser")).thenReturn(false);
            when(accountRepository.existsByEmail(TEST_EMAIL)).thenReturn(true);

            // when & then
            assertThatThrownBy(() -> accountService.signup(reqDto))
                    .isInstanceOf(InputBusinessException.class)
                    .satisfies(ex -> {
                        InputBusinessException exception = (InputBusinessException) ex;
                        assertThat(exception.getErrors()).containsEntry("email",
                                ErrorCode.DUPLICATE_EMAIL.getMessage());
                    });

            verify(accountRepository).existsByUsername("newuser");
            verify(accountRepository).existsByEmail(TEST_EMAIL);
        }
    }

    @Nested
    @DisplayName("updateEmail 메서드")
    class UpdateEmailTest {

        @Test
        @DisplayName("새로운 이메일로 업데이트 성공")
        void updateEmailSuccess() {
            // given
            String newEmail = "newemail@example.com";
            EmailUpdateReqDto reqDto = new EmailUpdateReqDto(newEmail, TEST_PASSWORD);

            when(passwordEncoder.matches(TEST_PASSWORD, ENCODED_PASSWORD)).thenReturn(true);
            when(accountRepository.existsByEmail(newEmail)).thenReturn(false);

            // when
            accountService.updateEmail(reqDto, authenticatedUser);

            // then
            verify(passwordEncoder).matches(TEST_PASSWORD, ENCODED_PASSWORD);
            verify(accountRepository).existsByEmail(newEmail);
            assertThat(testAccount.getEmail()).isEqualTo(newEmail);
        }

        @Test
        @DisplayName("현재 비밀번호가 틀렸을 때 예외 발생")
        void updateEmailWithIncorrectPassword() {
            // given
            String newEmail = "newemail@example.com";
            EmailUpdateReqDto reqDto = new EmailUpdateReqDto(newEmail, "wrongpassword");

            when(passwordEncoder.matches("wrongpassword", ENCODED_PASSWORD)).thenReturn(false);

            // when & then
            assertThatThrownBy(() -> accountService.updateEmail(reqDto, authenticatedUser))
                    .isInstanceOf(InputBusinessException.class)
                    .satisfies(ex -> {
                        InputBusinessException exception = (InputBusinessException) ex;
                        assertThat(exception.getErrors()).containsEntry("currentPassword",
                                ErrorCode.INCORRECT_PASSWORD.getMessage());
                    });

            verify(passwordEncoder).matches("wrongpassword", ENCODED_PASSWORD);
        }

        @Test
        @DisplayName("현재 이메일과 동일할 때 업데이트 시도 시 예외 발생")
        void updateEmailWithSameEmail() {
            // given
            EmailUpdateReqDto reqDto = new EmailUpdateReqDto(TEST_EMAIL, TEST_PASSWORD);

            when(passwordEncoder.matches(TEST_PASSWORD, ENCODED_PASSWORD)).thenReturn(true);

            // when & then
            assertThatThrownBy(() -> accountService.updateEmail(reqDto, authenticatedUser))
                    .isInstanceOf(InputBusinessException.class)
                    .satisfies(ex -> {
                        InputBusinessException exception = (InputBusinessException) ex;
                        assertThat(exception.getErrors()).containsEntry("newEmail",
                                ErrorCode.SAME_EMAIL.getMessage());
                    });

            verify(passwordEncoder).matches(TEST_PASSWORD, ENCODED_PASSWORD);
        }

        @Test
        @DisplayName("중복된 이메일로 업데이트 시도 시 예외 발생")
        void updateEmailWithDuplicateEmail() {
            // given
            String duplicateEmail = "duplicate@example.com";
            EmailUpdateReqDto reqDto = new EmailUpdateReqDto(duplicateEmail, TEST_PASSWORD);

            when(passwordEncoder.matches(TEST_PASSWORD, ENCODED_PASSWORD)).thenReturn(true);
            when(accountRepository.existsByEmail(duplicateEmail)).thenReturn(true);

            // when & then
            assertThatThrownBy(() -> accountService.updateEmail(reqDto, authenticatedUser))
                    .isInstanceOf(InputBusinessException.class)
                    .satisfies(ex -> {
                        InputBusinessException exception = (InputBusinessException) ex;
                        assertThat(exception.getErrors()).containsEntry("newEmail",
                                ErrorCode.DUPLICATE_EMAIL.getMessage());
                    });

            verify(passwordEncoder).matches(TEST_PASSWORD, ENCODED_PASSWORD);
            verify(accountRepository).existsByEmail(duplicateEmail);
        }
    }

    @Nested
    @DisplayName("updatePassword 메서드")
    class UpdatePasswordTest {

        @Test
        @DisplayName("새로운 비밀번호로 업데이트 성공")
        void updatePasswordSuccess() {
            // given
            String newPassword = "newpassword123!";
            String encodedNewPassword = "encodedNewPassword";
            PasswordUpdateReqDto reqDto = new PasswordUpdateReqDto(TEST_PASSWORD, newPassword);

            when(passwordEncoder.matches(TEST_PASSWORD, ENCODED_PASSWORD)).thenReturn(true);
            when(passwordEncoder.matches(newPassword, ENCODED_PASSWORD)).thenReturn(false);
            when(passwordEncoder.encode(newPassword)).thenReturn(encodedNewPassword);

            // when
            accountService.updatePassword(reqDto, authenticatedUser);

            // then
            verify(passwordEncoder).matches(TEST_PASSWORD, ENCODED_PASSWORD);
            verify(passwordEncoder).matches(newPassword, ENCODED_PASSWORD);
            verify(passwordEncoder).encode(newPassword);
            assertThat(testAccount.getPassword()).isEqualTo(encodedNewPassword);
        }

        @Test
        @DisplayName("현재 비밀번호가 틀렸을 때 예외 발생")
        void updatePasswordWithIncorrectCurrentPassword() {
            // given
            PasswordUpdateReqDto reqDto = new PasswordUpdateReqDto("wrongpassword", "newpassword123!");

            when(passwordEncoder.matches("wrongpassword", ENCODED_PASSWORD)).thenReturn(false);

            // when & then
            assertThatThrownBy(() -> accountService.updatePassword(reqDto, authenticatedUser))
                    .isInstanceOf(InputBusinessException.class)
                    .satisfies(ex -> {
                        InputBusinessException exception = (InputBusinessException) ex;
                        assertThat(exception.getErrors()).containsEntry("currentPassword",
                                ErrorCode.INCORRECT_PASSWORD.getMessage());
                    });

            verify(passwordEncoder).matches("wrongpassword", ENCODED_PASSWORD);
        }

        @Test
        @DisplayName("새 비밀번호가 현재 비밀번호와 동일할 때 예외 발생")
        void updatePasswordWithSamePassword() {
            // given
            PasswordUpdateReqDto reqDto = new PasswordUpdateReqDto(TEST_PASSWORD, TEST_PASSWORD);

            when(passwordEncoder.matches(TEST_PASSWORD, ENCODED_PASSWORD)).thenReturn(true);

            // when & then
            assertThatThrownBy(() -> accountService.updatePassword(reqDto, authenticatedUser))
                    .isInstanceOf(InputBusinessException.class)
                    .satisfies(ex -> {
                        InputBusinessException exception = (InputBusinessException) ex;
                        assertThat(exception.getErrors()).containsEntry("newPassword",
                                ErrorCode.SAME_PASSWORD.getMessage());
                    });

            verify(passwordEncoder, times(2)).matches(TEST_PASSWORD, ENCODED_PASSWORD);
        }
    }
}
