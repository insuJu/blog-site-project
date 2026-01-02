package com.project.blog.domain.account.service;

import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.IntStream;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.blog.domain.account.dto.req.AccountDeactivationReqDto;
import com.project.blog.domain.account.dto.req.AccountDeactivationVerifyReqDto;
import com.project.blog.domain.account.dto.req.EmailSignupVerificationReqDto;
import com.project.blog.domain.account.dto.req.EmailUpdateReqDto;
import com.project.blog.domain.account.dto.req.FindUsernameReqDto;
import com.project.blog.domain.account.dto.req.LocalWithOAuth2MergeReqDto;
import com.project.blog.domain.account.dto.req.OAuth2WithLocalMergeReqDto;
import com.project.blog.domain.account.dto.req.PasswordResetRequestReqDto;
import com.project.blog.domain.account.dto.req.PasswordResetVerifyReqDto;
import com.project.blog.domain.account.dto.req.PasswordUpdateReqDto;
import com.project.blog.domain.account.dto.req.SignupReqDto;
import com.project.blog.domain.account.dto.res.AccountDeactivationResDto;
import com.project.blog.domain.account.dto.res.UserInfoResDto;
import com.project.blog.domain.account.entity.Account;
import com.project.blog.domain.account.enums.RoleType;
import com.project.blog.domain.account.repository.AccountRepository;
import com.project.blog.domain.profile.entity.Profile;
import com.project.blog.domain.profile.service.ProfileService;
import com.project.blog.global.error.code.ErrorCode;
import com.project.blog.global.error.exception.BusinessException;
import com.project.blog.global.error.util.ErrorUtil;
import com.project.blog.global.mail.enums.EmailType;
import com.project.blog.global.mail.service.EmailService;
import com.project.blog.global.security.oauth2.service.CustomOAuth2User;
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

        public UserInfoResDto getUserInfo() {
                Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
                boolean isOAuth2Login = principal instanceof CustomOAuth2User;

                if (isOAuth2Login) {
                        CustomOAuth2User oauth2User = (CustomOAuth2User) principal;
                        Account account = accountRepository.findById(oauth2User.getId())
                                        .orElseThrow(() -> new BusinessException(ErrorCode.ACCOUNT_NOT_FOUND));
                        return UserInfoResDto.fromOAuth2(account);
                } else {
                        AuthenticatedUser authenticatedUser = (AuthenticatedUser) principal;
                        return UserInfoResDto.from(authenticatedUser);
                }
        }

        public UserInfoResDto getUserInfo(AuthenticatedUser authenticatedUser) {
                return UserInfoResDto.from(authenticatedUser);
        }

        public UserInfoResDto getUserInfoById(Long userId) {
                Account account = accountRepository.findById(userId)
                                .orElseThrow(() -> new BusinessException(ErrorCode.ACCOUNT_NOT_FOUND));
                return UserInfoResDto.from(account);
        }

        public void sendSignupVerificationCode(EmailSignupVerificationReqDto reqDto) {
                String email = reqDto.getEmail();
                boolean isSnsAccount = false;

                if (accountRepository.existsByEmail(email)) {
                        Account existingAccount = accountRepository.findByEmail(email)
                                        .orElseThrow(() -> new BusinessException(ErrorCode.DUPLICATE_EMAIL));

                        if (existingAccount.isOAuth2Account()) {
                                isSnsAccount = true;
                        } else {
                                throw new BusinessException(ErrorCode.DUPLICATE_EMAIL);
                        }
                }

                String code = verificationCodeService.generateCode();
                verificationCodeService.saveCode(email, VerificationType.EMAIL_SIGNUP, code);
                emailService.sendVerificationCode(email, code, EmailType.EMAIL_SIGNUP);

                if (isSnsAccount) {
                        throw new BusinessException(ErrorCode.EMAIL_REGISTERED_WITH_SNS);
                }
        }

        @Transactional
        public void signup(SignupReqDto reqDto) {
                String username = reqDto.getUsername();
                String email = reqDto.getEmail();
                String password = reqDto.getPassword();
                String nickname = reqDto.getNickname();
                String verificationCode = reqDto.getVerificationCode();

                Map<String, String> errors = new HashMap<>();

                ErrorUtil.addErrorIf(errors, accountRepository.existsByUsername(username), "username",
                                () -> ErrorCode.DUPLICATE_USERNAME.getMessage());
                ErrorUtil.addErrorIf(errors, accountRepository.existsByEmail(email), "email",
                                () -> ErrorCode.DUPLICATE_EMAIL.getMessage());

                ErrorUtil.throwIfNotEmpty(errors);

                verificationCodeService.validateCode(email, VerificationType.EMAIL_SIGNUP, verificationCode);

                Profile profile = profileService.createProfile(nickname);

                Account account = Account.builder()
                                .username(username)
                                .password(passwordEncoder.encode(password))
                                .email(email)
                                .roleType(RoleType.USER)
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

                if (!currentAccount.isOAuth2Account()) {
                        ErrorUtil.addErrorIf(errors,
                                        !passwordEncoder.matches(currentPassword, currentAccount.getPassword()),
                                        "currentPassword",
                                        () -> ErrorCode.INCORRECT_PASSWORD.getMessage());
                }

                ErrorUtil.addErrorIf(errors, currentAccount.getEmail().equals(newEmail), "newEmail",
                                () -> ErrorCode.SAME_EMAIL.getMessage());

                ErrorUtil.throwIfNotEmpty(errors);

                if (accountRepository.existsByEmail(newEmail)) {
                        if (currentAccount.isOAuth2Account()) {
                                throw new BusinessException(ErrorCode.EMAIL_REQUIRES_ACCOUNT_MERGE);
                        }
                        Map<String, String> duplicateError = new HashMap<>();
                        duplicateError.put("newEmail", ErrorCode.DUPLICATE_EMAIL.getMessage());
                        ErrorUtil.throwIfNotEmpty(duplicateError);
                }

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

        @Transactional
        public void mergeOAuth2WithLocal(OAuth2WithLocalMergeReqDto reqDto, AuthenticatedUser authenticatedUser) {
                Account oauth2Account = accountRepository.findById(authenticatedUser.getAccount().getId())
                                .orElseThrow(() -> new BusinessException(ErrorCode.ACCOUNT_NOT_FOUND));

                if (!oauth2Account.isOAuth2Account()) {
                        throw new BusinessException(ErrorCode.MERGE_TARGET_NOT_OAUTH2);
                }

                Account targetAccount = accountRepository.findByEmail(reqDto.getEmail())
                                .orElseThrow(() -> new BusinessException(ErrorCode.ACCOUNT_NOT_FOUND));

                if (oauth2Account.getId().equals(targetAccount.getId())) {
                        throw new BusinessException(ErrorCode.CANNOT_MERGE_SAME_ACCOUNT);
                }

                if (!passwordEncoder.matches(reqDto.getPassword(), targetAccount.getPassword())) {
                        Map<String, String> errors = new HashMap<>();
                        errors.put("password", ErrorCode.INCORRECT_PASSWORD.getMessage());
                        ErrorUtil.throwIfNotEmpty(errors);
                }

                targetAccount.updateOAuth2Info(oauth2Account.getOauth2Provider(), oauth2Account.getProviderId());

                accountRepository.delete(oauth2Account);
        }

        @Transactional
        public void mergeLocalWithOAuth2(LocalWithOAuth2MergeReqDto reqDto) {
                String email = reqDto.getEmail();
                String username = reqDto.getUsername();
                String password = reqDto.getPassword();
                String nickname = reqDto.getNickname();
                String verificationCode = reqDto.getVerificationCode();

                Account oauth2Account = accountRepository.findByEmail(email)
                                .orElseThrow(() -> new BusinessException(ErrorCode.ACCOUNT_NOT_FOUND));

                if (!oauth2Account.isOAuth2Account()) {
                        throw new BusinessException(ErrorCode.MERGE_SOURCE_NOT_OAUTH2);
                }

                Map<String, String> errors = new HashMap<>();

                ErrorUtil.addErrorIf(errors, accountRepository.existsByUsername(username), "username",
                                () -> ErrorCode.DUPLICATE_USERNAME.getMessage());

                ErrorUtil.throwIfNotEmpty(errors);

                verificationCodeService.validateCode(email, VerificationType.EMAIL_SIGNUP, verificationCode);

                oauth2Account.updateUsername(username);
                oauth2Account.updatePassword(passwordEncoder.encode(password));
                oauth2Account.getProfile().updateNickname(nickname);
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

        @Transactional
        public void unlinkOAuth2(AuthenticatedUser authenticatedUser) {
                Account account = accountRepository.findById(authenticatedUser.getAccount().getId())
                                .orElseThrow(() -> new BusinessException(ErrorCode.ACCOUNT_NOT_FOUND));

                if (!account.isLinkedAccount()) {
                        throw new BusinessException(ErrorCode.OAUTH2_NOT_LINKED);
                }

                account.unlinkOAuth2();
        }

        @Transactional
        public AccountDeactivationResDto requestAccountDeactivation(AccountDeactivationReqDto reqDto,
                        AuthenticatedUser authenticatedUser) {
                Account account = accountRepository.findById(authenticatedUser.getAccount().getId())
                                .orElseThrow(() -> new BusinessException(ErrorCode.ACCOUNT_NOT_FOUND));

                boolean isCurrentlyOAuth2Login = "OAUTH2".equals(authenticatedUser.getLoginMethod());

                if (isCurrentlyOAuth2Login) {
                        if (account.isLinkedAccount()) {
                                account.unlinkOAuth2();
                        } else {
                                refreshTokenService.deleteRefreshToken(account.getId());
                                accountRepository.delete(account);
                        }
                        return AccountDeactivationResDto.builder()
                                        .requiresVerification(false)
                                        .build();
                }

                if (account.isDeactivated()) {
                        throw new BusinessException(ErrorCode.ACCOUNT_ALREADY_DEACTIVATED);
                }

                String password = reqDto.getPassword();
                if (password == null || password.isBlank()) {
                        Map<String, String> errors = new HashMap<>();
                        errors.put("password", "비밀번호는 필수 입력값입니다.");
                        ErrorUtil.throwIfNotEmpty(errors);
                }

                if (!passwordEncoder.matches(password, account.getPassword())) {
                        Map<String, String> errors = new HashMap<>();
                        errors.put("password", "비밀번호가 일치하지 않습니다.");
                        ErrorUtil.throwIfNotEmpty(errors);
                }

                String code = verificationCodeService.generateCode();
                verificationCodeService.saveCode(account.getEmail(), VerificationType.ACCOUNT_DELETION, code);
                emailService.sendVerificationCode(account.getEmail(), code, EmailType.ACCOUNT_DELETION);

                return AccountDeactivationResDto.builder()
                                .requiresVerification(true)
                                .build();
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
