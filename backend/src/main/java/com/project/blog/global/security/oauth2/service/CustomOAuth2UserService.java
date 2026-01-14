package com.project.blog.global.security.oauth2.service;

import java.util.Map;
import java.util.Optional;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.blog.domain.account.entity.Account;
import com.project.blog.domain.account.enums.OAuth2Provider;
import com.project.blog.domain.account.enums.RoleType;
import com.project.blog.domain.account.repository.AccountRepository;
import com.project.blog.domain.profile.entity.Profile;
import com.project.blog.domain.profile.service.ProfileService;
import com.project.blog.global.error.code.ErrorCode;
import com.project.blog.global.error.exception.BusinessException;
import com.project.blog.global.security.oauth2.userinfo.OAuth2UserInfo;
import com.project.blog.global.security.oauth2.userinfo.OAuth2UserInfoFactory;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final AccountRepository accountRepository;
    private final ProfileService profileService;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        Map<String, Object> attributes = oAuth2User.getAttributes();

        OAuth2Provider provider = OAuth2Provider.fromString(registrationId);
        if (provider == null) {
            throw new BusinessException(ErrorCode.OAUTH2_PROVIDER_NOT_SUPPORTED);
        }

        OAuth2UserInfo oAuth2UserInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(provider, attributes);

        String providerId = oAuth2UserInfo.getProviderId();
        String email = oAuth2UserInfo.getEmail();

        if (email == null || email.isEmpty()) {
            email = generateOAuth2Email(provider, providerId);
            log.info("OAuth2 email not provided, generated email: {}", email);
        }

        AccountResult accountResult = getOrCreateAccount(provider, providerId, email);

        return new CustomOAuth2User(accountResult.account(), attributes, accountResult.isNewUser());
    }

    private AccountResult getOrCreateAccount(OAuth2Provider provider, String providerId, String email) {
        Optional<Account> existingOAuth2Account = accountRepository.findByOauth2ProviderAndProviderId(provider,
                providerId);
        if (existingOAuth2Account.isPresent()) {
            Account account = existingOAuth2Account.get();
            if (account.isDeactivated()) {
                throw new BusinessException(ErrorCode.ACCOUNT_ALREADY_DEACTIVATED);
            }
            return new AccountResult(account, false);
        }

        Optional<Account> existingLocalAccount = accountRepository.findByEmail(email);
        if (existingLocalAccount.isPresent()) {
            Account account = existingLocalAccount.get();
            if (account.isDeactivated()) {
                throw new BusinessException(ErrorCode.ACCOUNT_ALREADY_DEACTIVATED);
            }
            account.updateOAuth2Info(provider, providerId);
            return new AccountResult(accountRepository.save(account), true);
        }

        return new AccountResult(createNewOAuth2Account(provider, providerId, email), true);
    }

    private record AccountResult(Account account, boolean isNewUser) {
    }

    private Account createNewOAuth2Account(OAuth2Provider provider, String providerId, String email) {
        String username = generateUniqueUsername(provider, providerId);

        Profile profile = profileService.createProfile(username);

        Account account = Account.builder()
                .username(username)
                .password(null)
                .email(email)
                .oauth2Provider(provider)
                .providerId(providerId)
                .roleType(RoleType.USER)
                .profile(profile)
                .build();

        return accountRepository.save(account);
    }

    private String generateUniqueUsername(OAuth2Provider provider, String providerId) {
        String baseUsername = provider.name().toLowerCase() + "_"

                + providerId.substring(0, Math.min(8, providerId.length()));

        String username = baseUsername;

        int suffix = 1;

        while (accountRepository.existsByUsername(username)) {
            username = baseUsername + suffix;
            suffix++;
        }

        return username;
    }

    private String generateOAuth2Email(OAuth2Provider provider, String providerId) {
        return provider.name().toLowerCase() + "_" + providerId + "@oauth2.local";
    }
}
