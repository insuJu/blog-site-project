package com.project.blog.domain.admin.dto.res;

import java.time.LocalDateTime;

import com.project.blog.domain.account.entity.Account;
import com.project.blog.domain.account.enums.AccountStatus;
import com.project.blog.domain.account.enums.OAuth2Provider;
import com.project.blog.domain.account.enums.RoleType;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdminAccountResDto {
    private Long id;
    private String username;
    private String email;
    private RoleType roleType;
    private AccountStatus status;
    private OAuth2Provider oauth2Provider;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;
    private LocalDateTime deactivatedAt;
    private ProfileInfo profile;
    private Long postCount;
    private Long commentCount;

    @Getter
    @Builder
    public static class ProfileInfo {
        private String nickname;
        private String blogName;
        private String avatar;
        private LocalDateTime createdAt;
        private LocalDateTime modifiedAt;
    }

    public static AdminAccountResDto from(Account account, Long postCount, Long commentCount) {
        ProfileInfo profileInfo = null;
        if (account.getProfile() != null) {
            profileInfo = ProfileInfo.builder()
                .nickname(account.getProfile().getNickname())
                .blogName(account.getProfile().getBlogName())
                .avatar(account.getProfile().getAvatar())
                .createdAt(account.getProfile().getCreatedAt())
                .modifiedAt(account.getProfile().getModifiedAt())
                .build();
        }

        return AdminAccountResDto.builder()
            .id(account.getId())
            .username(account.getUsername())
            .email(account.getEmail())
            .roleType(account.getRoleType())
            .status(account.getStatus())
            .oauth2Provider(account.getOauth2Provider())
            .createdAt(account.getCreatedAt())
            .modifiedAt(account.getModifiedAt())
            .deactivatedAt(account.getDeactivatedAt())
            .profile(profileInfo)
            .postCount(postCount)
            .commentCount(commentCount)
            .build();
    }
}
