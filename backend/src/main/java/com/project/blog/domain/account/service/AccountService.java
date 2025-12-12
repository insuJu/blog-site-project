package com.project.blog.domain.account.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
import com.project.blog.global.error.exception.BusinessException;
import com.project.blog.global.error.util.ErrorUtil;
import com.project.blog.global.security.service.AuthenticatedUser;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AccountService {
        private final AccountRepository accountRepository;
        private final BCryptPasswordEncoder passwordEncoder;
        private final ProfileService profileService;

        public UserInfoResDto getUserInfo(AuthenticatedUser authenticatedUser) {
                return UserInfoResDto.from(authenticatedUser);
        }

        public UserInfoResDto getUserInfoById(Long userId) {
                Account account = accountRepository.findById(userId)
                                .orElseThrow(() -> new BusinessException(ErrorCode.ACCOUNT_NOT_FOUND));
                return UserInfoResDto.from(account);
        }

        @Transactional
        public void signup(SignupReqDto reqDto) {
                String username = reqDto.getUsername();
                String email = reqDto.getEmail();
                String password = reqDto.getPassword();
                String nickname = reqDto.getNickname();

                Map<String, String> errors = new HashMap<>();

                ErrorUtil.addErrorIf(errors, accountRepository.existsByUsername(username), "username",
                                () -> ErrorCode.DUPLICATE_USERNAME.getMessage());
                ErrorUtil.addErrorIf(errors, accountRepository.existsByEmail(email), "email",
                                () -> ErrorCode.DUPLICATE_EMAIL.getMessage());

                ErrorUtil.throwIfNotEmpty(errors);

                Profile profile = profileService.createProfile(nickname);

                Account account = Account.builder()
                                .username(username)
                                .password(passwordEncoder.encode(password))
                                .email(email)
                                .roleType(RoleType.USER)
                                .loginType(LoginType.LOCAL)
                                .profile(profile)
                                .build();

                accountRepository.save(account);
        }

        @Transactional
        public void updateEmail(EmailUpdateReqDto reqDto, AuthenticatedUser authenticatedUser) {
                Account currentAccount = authenticatedUser.getAccount();
                String newEmail = reqDto.getNewEmail();
                String currentPassword = reqDto.getCurrentPassword();

                Map<String, String> errors = new HashMap<>();

                ErrorUtil.addErrorIf(errors, !passwordEncoder.matches(currentPassword, currentAccount.getPassword()), "currentPassword",
                                () -> ErrorCode.INCORRECT_PASSWORD.getMessage());
                ErrorUtil.addErrorIf(errors, currentAccount.getEmail().equals(newEmail), "newEmail",
                                () -> ErrorCode.SAME_EMAIL.getMessage());
                ErrorUtil.addErrorIf(errors, accountRepository.existsByEmail(newEmail), "newEmail",
                                () -> ErrorCode.DUPLICATE_EMAIL.getMessage());

                ErrorUtil.throwIfNotEmpty(errors);

                currentAccount.updateEmail(newEmail);
        }

        @Transactional
        public void updatePassword(PasswordUpdateReqDto reqDto, AuthenticatedUser authenticatedUser) {
                Account currentAccount = authenticatedUser.getAccount();
                String currentPassword = reqDto.getCurrentPassword();
                String newPassword = reqDto.getNewPassword();

                Map<String, String> errors = new HashMap<>();

                ErrorUtil.addErrorIf(errors, !passwordEncoder.matches(currentPassword, currentAccount.getPassword()), "currentPassword",
                                () -> ErrorCode.INCORRECT_PASSWORD.getMessage());
                ErrorUtil.addErrorIf(errors, passwordEncoder.matches(newPassword, currentAccount.getPassword()), "newPassword",
                                () -> ErrorCode.SAME_PASSWORD.getMessage());

                ErrorUtil.throwIfNotEmpty(errors);

                currentAccount.updatePassword(passwordEncoder.encode(newPassword));
        }
}
