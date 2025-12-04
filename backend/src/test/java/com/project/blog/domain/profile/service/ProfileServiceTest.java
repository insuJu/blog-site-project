package com.project.blog.domain.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.project.blog.domain.account.entity.Account;
import com.project.blog.domain.account.enums.LoginType;
import com.project.blog.domain.account.enums.RoleType;
import com.project.blog.domain.account.repository.AccountRepository;
import com.project.blog.domain.profile.dto.req.BlogNameUpdateReqDto;
import com.project.blog.domain.profile.dto.req.NicknameUpdateReqDto;
import com.project.blog.domain.profile.entity.Profile;
import com.project.blog.domain.profile.repository.ProfileRepository;
import com.project.blog.global.error.code.ErrorCode;
import com.project.blog.global.error.exception.BusinessException;
import com.project.blog.global.error.exception.InputBusinessException;
import com.project.blog.global.security.service.AuthenticatedUser;

@ExtendWith(MockitoExtension.class)
@DisplayName("ProfileService 단위 테스트")
class ProfileServiceTest {

    @Mock
    private ProfileRepository profileRepository;

    @Mock
    private AccountRepository accountRepository;

    @InjectMocks
    private ProfileService profileService;

    private Account testAccount;
    private Profile testProfile;
    private AuthenticatedUser authenticatedUser;

    private static final String TEST_USERNAME = "testuser";
    private static final String TEST_EMAIL = "test@example.com";
    private static final String TEST_NICKNAME = "testuser";
    private static final String TEST_BLOG_NAME = "testuser의 블로그";
    private static final String ENCODED_PASSWORD = "encodedPassword";

    @BeforeEach
    void setUp() {
        testProfile = Profile.builder()
                .id(1L)
                .nickname(TEST_NICKNAME)
                .blogName(TEST_BLOG_NAME)
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

    private void mockAccountFound(Account account) {
        when(accountRepository.findById(account.getId())).thenReturn(Optional.of(account));
    }

    @Nested
    @DisplayName("createProfile 메서드")
    class CreateProfileTest {

        @Test
        @DisplayName("프로필 생성 성공")
        void createProfileSuccess() {
            // given
            String nickname = "newuser";

            when(profileRepository.existsByNickname(nickname)).thenReturn(false);
            when(profileRepository.save(any(Profile.class))).thenReturn(testProfile);

            // when
            Profile result = profileService.createProfile(nickname);

            // then
            assertThat(result).isNotNull();
            verify(profileRepository).existsByNickname(nickname);
            verify(profileRepository).save(any(Profile.class));
        }

        @Test
        @DisplayName("중복된 닉네임으로 프로필 생성 시 예외 발생")
        void createProfileWithDuplicateNickname() {
            // given
            String nickname = "existinguser";

            when(profileRepository.existsByNickname(nickname)).thenReturn(true);

            // when & then
            assertThatThrownBy(() -> profileService.createProfile(nickname))
                    .isInstanceOf(InputBusinessException.class)
                    .satisfies(ex -> {
                        InputBusinessException exception = (InputBusinessException) ex;
                        assertThat(exception.getErrors()).containsEntry("nickname",
                                ErrorCode.DUPLICATE_NICKNAME.getMessage());
                    });

            verify(profileRepository).existsByNickname(nickname);
        }
    }

    @Nested
    @DisplayName("updateNickname 메서드")
    class UpdateNicknameTest {

        @Test
        @DisplayName("새로운 닉네임으로 업데이트 성공")
        void updateNicknameSuccess() {
            // given
            String newNickname = "newnickname";
            NicknameUpdateReqDto reqDto = new NicknameUpdateReqDto(newNickname);

            mockAccountFound(testAccount);
            when(profileRepository.existsByNickname(newNickname)).thenReturn(false);

            // when
            profileService.updateNickname(reqDto, authenticatedUser);

            // then
            verify(accountRepository).findById(testAccount.getId());
            verify(profileRepository).existsByNickname(newNickname);
            assertThat(testProfile.getNickname()).isEqualTo(newNickname);
        }

        @Test
        @DisplayName("존재하지 않는 Account로 업데이트 시도 시 예외 발생")
        void updateNicknameWithNonExistentAccount() {
            // given
            NicknameUpdateReqDto reqDto = new NicknameUpdateReqDto("newnickname");

            when(accountRepository.findById(authenticatedUser.getAccount().getId())).thenReturn(Optional.empty());

            // when & then
            assertThatThrownBy(() -> profileService.updateNickname(reqDto, authenticatedUser))
                    .isInstanceOf(BusinessException.class)
                    .hasFieldOrPropertyWithValue("errorCode", ErrorCode.ACCOUNT_NOT_FOUND);

            verify(accountRepository).findById(authenticatedUser.getAccount().getId());
        }

        @Test
        @DisplayName("Profile이 없는 Account로 업데이트 시도 시 예외 발생")
        void updateNicknameWithoutProfile() {
            // given
            Account accountWithoutProfile = Account.builder()
                    .id(2L)
                    .username("user2")
                    .password("encodedPassword")
                    .email("user2@example.com")
                    .roleType(RoleType.USER)
                    .loginType(LoginType.LOCAL)
                    .profile(null)
                    .build();
            AuthenticatedUser userWithoutProfile = new AuthenticatedUser(accountWithoutProfile);
            NicknameUpdateReqDto reqDto = new NicknameUpdateReqDto("newnickname");

            when(accountRepository.findById(2L)).thenReturn(Optional.of(accountWithoutProfile));

            // when & then
            assertThatThrownBy(() -> profileService.updateNickname(reqDto, userWithoutProfile))
                    .isInstanceOf(BusinessException.class)
                    .hasFieldOrPropertyWithValue("errorCode", ErrorCode.PROFILE_NOT_FOUND);
        }

        @Test
        @DisplayName("현재 닉네임과 동일할 때 업데이트 시도 시 예외 발생")
        void updateNicknameWithSameNickname() {
            // given
            NicknameUpdateReqDto reqDto = new NicknameUpdateReqDto(TEST_NICKNAME);

            mockAccountFound(testAccount);

            // when & then
            assertThatThrownBy(() -> profileService.updateNickname(reqDto, authenticatedUser))
                    .isInstanceOf(InputBusinessException.class)
                    .satisfies(ex -> {
                        InputBusinessException exception = (InputBusinessException) ex;
                        assertThat(exception.getErrors()).containsEntry("newNickname",
                                ErrorCode.SAME_NICKNAME.getMessage());
                    });
        }

        @Test
        @DisplayName("중복된 닉네임으로 업데이트 시도 시 예외 발생")
        void updateNicknameWithDuplicateNickname() {
            // given
            String duplicateNickname = "duplicatenickname";
            NicknameUpdateReqDto reqDto = new NicknameUpdateReqDto(duplicateNickname);

            mockAccountFound(testAccount);
            when(profileRepository.existsByNickname(duplicateNickname)).thenReturn(true);

            // when & then
            assertThatThrownBy(() -> profileService.updateNickname(reqDto, authenticatedUser))
                    .isInstanceOf(InputBusinessException.class)
                    .satisfies(ex -> {
                        InputBusinessException exception = (InputBusinessException) ex;
                        assertThat(exception.getErrors()).containsEntry("newNickname",
                                ErrorCode.DUPLICATE_NICKNAME.getMessage());
                    });

            verify(profileRepository).existsByNickname(duplicateNickname);
        }
    }

    @Nested
    @DisplayName("updateBlogName 메서드")
    class UpdateBlogNameTest {

        @Test
        @DisplayName("새로운 블로그명으로 업데이트 성공")
        void updateBlogNameSuccess() {
            // given
            String newBlogName = "새로운 블로그";
            BlogNameUpdateReqDto reqDto = new BlogNameUpdateReqDto(newBlogName);

            mockAccountFound(testAccount);
            when(profileRepository.existsByBlogName(newBlogName)).thenReturn(false);

            // when
            profileService.updateBlogName(reqDto, authenticatedUser);

            // then
            verify(accountRepository).findById(testAccount.getId());
            verify(profileRepository).existsByBlogName(newBlogName);
            assertThat(testProfile.getBlogName()).isEqualTo(newBlogName);
        }

        @Test
        @DisplayName("존재하지 않는 Account로 업데이트 시도 시 예외 발생")
        void updateBlogNameWithNonExistentAccount() {
            // given
            BlogNameUpdateReqDto reqDto = new BlogNameUpdateReqDto("newblogname");

            when(accountRepository.findById(testAccount.getId())).thenReturn(Optional.empty());

            // when & then
            assertThatThrownBy(() -> profileService.updateBlogName(reqDto, authenticatedUser))
                    .isInstanceOf(BusinessException.class)
                    .hasFieldOrPropertyWithValue("errorCode", ErrorCode.ACCOUNT_NOT_FOUND);

            verify(accountRepository).findById(testAccount.getId());
        }

        @Test
        @DisplayName("Profile이 없는 Account로 업데이트 시도 시 예외 발생")
        void updateBlogNameWithoutProfile() {
            // given
            Account accountWithoutProfile = Account.builder()
                    .id(2L)
                    .username("user2")
                    .password("encodedPassword")
                    .email("user2@example.com")
                    .roleType(RoleType.USER)
                    .loginType(LoginType.LOCAL)
                    .profile(null)
                    .build();
            AuthenticatedUser userWithoutProfile = new AuthenticatedUser(accountWithoutProfile);
            BlogNameUpdateReqDto reqDto = new BlogNameUpdateReqDto("newblogname");

            when(accountRepository.findById(2L)).thenReturn(Optional.of(accountWithoutProfile));

            // when & then
            assertThatThrownBy(() -> profileService.updateBlogName(reqDto, userWithoutProfile))
                    .isInstanceOf(BusinessException.class)
                    .hasFieldOrPropertyWithValue("errorCode", ErrorCode.PROFILE_NOT_FOUND);
        }

        @Test
        @DisplayName("현재 블로그명과 동일할 때 업데이트 예외 발생")
        void updateBlogNameWithSameBlogName() {
            // given
            BlogNameUpdateReqDto reqDto = new BlogNameUpdateReqDto(TEST_BLOG_NAME);

            mockAccountFound(testAccount);

            // when & then
            assertThatThrownBy(() -> profileService.updateBlogName(reqDto, authenticatedUser))
                    .isInstanceOf(InputBusinessException.class)
                    .satisfies(ex -> {
                        InputBusinessException exception = (InputBusinessException) ex;
                        assertThat(exception.getErrors()).containsEntry("newBlogName",
                                ErrorCode.SAME_BLOGNAME.getMessage());
                    });
        }

        @Test
        @DisplayName("중복된 블로그명으로 업데이트 시도 시 예외 발생")
        void updateBlogNameWithDuplicateBlogName() {
            // given
            String newBlogName = "중복된 블로그";
            BlogNameUpdateReqDto reqDto = new BlogNameUpdateReqDto(newBlogName);

            mockAccountFound(testAccount);
            when(profileRepository.existsByBlogName(newBlogName)).thenReturn(true);

            // when & then
            assertThatThrownBy(() -> profileService.updateBlogName(reqDto, authenticatedUser))
                    .isInstanceOf(InputBusinessException.class)
                    .satisfies(ex -> {
                        InputBusinessException exception = (InputBusinessException) ex;
                        assertThat(exception.getErrors()).containsEntry("newBlogName",
                                ErrorCode.DUPLICATE_BLOGNAME.getMessage());
                    });

            verify(profileRepository).existsByBlogName(newBlogName);
        }
    }
}