package com.project.blog.global.security.oauth2.userinfo;

import java.util.Map;

import com.project.blog.domain.account.enums.OAuth2Provider;
import com.project.blog.global.error.code.ErrorCode;
import com.project.blog.global.error.exception.BusinessException;

public class OAuth2UserInfoFactory {

    private OAuth2UserInfoFactory() {
    }

    public static OAuth2UserInfo getOAuth2UserInfo(OAuth2Provider provider, Map<String, Object> attributes) {
        switch (provider) {
            case GOOGLE:
                return new GoogleOAuth2UserInfo(attributes);
            case GITHUB:
                return new GithubOAuth2UserInfo(attributes);
            default:
                throw new BusinessException(ErrorCode.OAUTH2_PROVIDER_NOT_SUPPORTED);
        }
    }
}
