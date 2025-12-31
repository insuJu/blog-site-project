package com.project.blog.domain.account.entity;

import java.time.LocalDateTime;

import com.project.blog.domain.account.enums.AccountStatus;
import com.project.blog.domain.account.enums.OAuth2Provider;
import com.project.blog.domain.account.enums.RoleType;
import com.project.blog.domain.profile.entity.Profile;
import com.project.blog.global.entity.BaseTimeEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class Account extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, length = 20)
    private String username;

    @Column(length = 60)
    private String password;

    @Column(length = 100)
    private String providerId;

    @Enumerated(EnumType.STRING)
    @Column
    private OAuth2Provider oauth2Provider;

    @Column(nullable = false, unique = true, length = 50)
    private String email;

    @Enumerated(EnumType.STRING)
    private RoleType roleType;

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "profile_id", nullable = false, unique = true)
    private Profile profile;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private AccountStatus status = AccountStatus.ACTIVE;

    @Column
    private LocalDateTime deactivatedAt;

    public void updateEmail(String email) {
        this.email = email;
    }

    public void updateUsername(String username) {
        this.username = username;
    }

    public void updatePassword(String password) {
        this.password = password;
    }

    public void deactivate() {
        this.status = AccountStatus.DEACTIVATED;
        this.deactivatedAt = LocalDateTime.now();
    }

    public void activate() {
        this.status = AccountStatus.ACTIVE;
        this.deactivatedAt = null;
    }

    public boolean isDeactivated() {
        return this.status == AccountStatus.DEACTIVATED;
    }

    public void updateOAuth2Info(OAuth2Provider oauth2Provider, String providerId) {
        this.oauth2Provider = oauth2Provider;
        this.providerId = providerId;
    }

    public void unlinkOAuth2() {
        this.oauth2Provider = null;
        this.providerId = null;
    }

    public boolean isOAuth2Account() {
        return oauth2Provider != null;
    }

    public boolean isLinkedAccount() {
        return this.password != null && this.oauth2Provider != null;
    }

}
