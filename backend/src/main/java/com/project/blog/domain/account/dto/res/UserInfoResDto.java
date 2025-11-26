package com.project.blog.domain.account.dto.res;

import com.project.blog.domain.account.entity.Account;
import com.project.blog.domain.account.enums.LoginType;
import com.project.blog.domain.account.enums.RoleType;
import com.project.blog.domain.profile.entity.Profile;
import com.project.blog.global.security.service.AuthenticatedUser;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserInfoResDto {
        private int id;
        private String username;
        private String email;
        private RoleType roleType;
        private LoginType loginType;
        private ProfileInfo profile;

        @Getter
        @Builder
        public static class ProfileInfo {
                private int id;
                private String nickname;
                private String blogName;
                private String avatar;
        }

        public static UserInfoResDto from(AuthenticatedUser authenticatedUser) {
                Account account = authenticatedUser.getAccount();
                Profile profile = account.getProfile();

                return UserInfoResDto.builder()
                                .id(account.getId())
                                .username(account.getUsername())
                                .email(account.getEmail())
                                .roleType(account.getRoleType())
                                .loginType(account.getLoginType())
                                .profile(ProfileInfo.builder()
                                                .id(profile.getId())
                                                .nickname(profile.getNickname())
                                                .blogName(profile.getBlogName())
                                                .avatar(profile.getAvatar())
                                                .build())
                                .build();
        }
}
