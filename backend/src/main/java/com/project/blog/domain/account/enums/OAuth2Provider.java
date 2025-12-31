package com.project.blog.domain.account.enums;

public enum OAuth2Provider {
    GOOGLE, GITHUB;

    public static OAuth2Provider fromString(String provider) {
        if (provider == null) {
            return null;
        }
        return OAuth2Provider.valueOf(provider.toUpperCase());
    }
}
