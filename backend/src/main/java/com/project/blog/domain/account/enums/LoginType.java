package com.project.blog.domain.account.enums;

public enum LoginType {
    LOCAL, SNS;

    public enum SNS {
        KAKAO, NAVER, GOOGLE;
    }
}
