package com.project.blog.global.security.oauth2.userinfo;

import java.util.Map;

import com.project.blog.domain.account.enums.OAuth2Provider;

public abstract class OAuth2UserInfo {
    protected Map<String, Object> attributes;

    public OAuth2UserInfo(Map<String, Object> attributes) {
        this.attributes = attributes;
    }

    public abstract String getProviderId();

    public abstract OAuth2Provider getProvider();

    public abstract String getEmail();

    public abstract String getName();
}
