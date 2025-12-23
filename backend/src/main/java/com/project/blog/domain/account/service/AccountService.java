package com.project.blog.domain.account.service;

import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.IntStream;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.blog.domain.account.dto.req.AccountDeactivationVerifyReqDto;
import com.project.blog.domain.account.dto.req.EmailUpdateReqDto;
import com.project.blog.domain.account.dto.req.FindUsernameReqDto;
import com.project.blog.domain.account.dto.req.PasswordResetRequestReqDto;
import com.project.blog.domain.account.dto.req.PasswordResetVerifyReqDto;
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
import com.project.blog.global.mail.enums.EmailType;
import com.project.blog.global.mail.service.EmailService;
import com.project.blog.global.security.service.AuthenticatedUser;
import com.project.blog.global.verification.enums.VerificationType;
import com.project.blog.global.verification.service.VerificationCodeService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AccountService {
        private final AccountRepository accountRepository;
        private final BCryptPasswordEncoder passwordEncoder;
        private final ProfileService profileService;
        private final EmailService emailService;
        private final VerificationCodeService verificationCodeService;
        private final RefreshTokenService refreshTokenService;
        private final SecureRandom random = new SecureRandom();

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
                Account currentAccount = accountRepository.findById(authenticatedUser.getAccount().getId())
                                .orElseThrow(() -> new BusinessException(ErrorCode.ACCOUNT_NOT_FOUND));
                String newEmail = reqDto.getNewEmail();
                String currentPassword = reqDto.getCurrentPassword();

                Map<String, String> errors = new HashMap<>();

                ErrorUtil.addErrorIf(errors, !passwordEncoder.matches(currentPassword, currentAccount.getPassword()),
                                "currentPassword",
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
                Account currentAccount = accountRepository.findById(authenticatedUser.getAccount().getId())
                                .orElseThrow(() -> new BusinessException(ErrorCode.ACCOUNT_NOT_FOUND));
                String currentPassword = reqDto.getCurrentPassword();
                String newPassword = reqDto.getNewPassword();

                Map<String, String> errors = new HashMap<>();

                ErrorUtil.addErrorIf(errors, !passwordEncoder.matches(currentPassword, currentAccount.getPassword()),
                                "currentPassword",
                                () -> ErrorCode.INCORRECT_PASSWORD.getMessage());
                ErrorUtil.addErrorIf(errors, passwordEncoder.matches(newPassword, currentAccount.getPassword()),
                                "newPassword",
                                () -> ErrorCode.SAME_PASSWORD.getMessage());

                ErrorUtil.throwIfNotEmpty(errors);

                currentAccount.updatePassword(passwordEncoder.encode(newPassword));
        }

        @Transactional(readOnly = true)
        public void findUsername(FindUsernameReqDto reqDto) {
                String email = reqDto.getEmail();
                Account account = accountRepository.findByEmail(email)
                                .orElseThrow(() -> new BusinessException(ErrorCode.USERNAME_NOT_FOUND_BY_EMAIL));

                emailService.sendUsername(email, account.getUsername());
        }

        @Transactional(readOnly = true)
        public void requestPasswordReset(PasswordResetRequestReqDto reqDto) {
                String username = reqDto.getUsername();
                Account account = accountRepository.findByUsername(username)
                                .orElseThrow(() -> new BusinessException(ErrorCode.ACCOUNT_NOT_FOUND));

                if (!account.getEmail().equals(reqDto.getEmail())) {
                        throw new BusinessException(ErrorCode.EMAIL_MISMATCH);
                }

                String code = verificationCodeService.generateCode();
                verificationCodeService.saveCode(username, VerificationType.PASSWORD_RESET, code);
                emailService.sendVerificationCode(account.getEmail(), code, EmailType.PASSWORD_RESET);
        }

        @Transactional
        public void verifyPasswordReset(PasswordResetVerifyReqDto reqDto) {
                String username = reqDto.getUsername();
                String code = reqDto.getVerificationCode();

                Account account = accountRepository.findByUsername(username)
                                .orElseThrow(() -> new BusinessException(ErrorCode.ACCOUNT_NOT_FOUND));

                verificationCodeService.validateCode(username, VerificationType.PASSWORD_RESET, code);

                String tempPassword = generateTemporaryPassword();
                account.updatePassword(passwordEncoder.encode(tempPassword));

                emailService.sendTemporaryPassword(account.getEmail(), tempPassword);
        }

        private String generateTemporaryPassword() {
                String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
                return IntStream.range(0, 12)
                                .map(i -> chars.charAt(random.nextInt(chars.length())))
                                .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
                                .toString();
        }

        @Transactional(readOnly = true)
        public void requestAccountDeactivation(AuthenticatedUser authenticatedUser) {
                Account account = accountRepository.findById(authenticatedUser.getAccount().getId())
                                .orElseThrow(() -> new BusinessException(ErrorCode.ACCOUNT_NOT_FOUND));

                if (account.isDeactivated()) {
                        throw new BusinessException(ErrorCode.ACCOUNT_ALREADY_DEACTIVATED);
                }

                String code = verificationCodeService.generateCode();
                verificationCodeService.saveCode(account.getEmail(), VerificationType.ACCOUNT_DELETION, code);
                emailService.sendVerificationCode(account.getEmail(), code, EmailType.ACCOUNT_DELETION);
        }

        @Transactional
        public void verifyAccountDeactivation(AccountDeactivationVerifyReqDto reqDto,
                        AuthenticatedUser authenticatedUser) {
                Account account = accountRepository.findById(authenticatedUser.getAccount().getId())
                                .orElseThrow(() -> new BusinessException(ErrorCode.ACCOUNT_NOT_FOUND));
                String code = reqDto.getVerificationCode();

                verificationCodeService.validateCode(account.getEmail(), VerificationType.ACCOUNT_DELETION, code);

                account.deactivate();
                refreshTokenService.deleteRefreshToken(account.getId());
        }

        @Transactional
        public void reactivateAccount(AuthenticatedUser authenticatedUser) {
                Account account = accountRepository.findById(authenticatedUser.getAccount().getId())
                                .orElseThrow(() -> new BusinessException(ErrorCode.ACCOUNT_NOT_FOUND));

                if (!account.isDeactivated()) {
                        throw new BusinessException(ErrorCode.ACCOUNT_NOT_DEACTIVATED);
                }

                account.activate();
        }
}
