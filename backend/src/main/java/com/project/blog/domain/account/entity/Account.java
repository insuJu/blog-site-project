package com.project.blog.domain.account.entity;

import com.project.blog.domain.account.enums.LoginType;
import com.project.blog.domain.account.enums.RoleType;
import com.project.blog.domain.profile.entity.Profile;
import com.project.blog.global.entity.BaseTimeEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Account extends BaseTimeEntity {
    // fields
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, unique = true, length = 20)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true, length = 50)
    private String email;

    @Enumerated(EnumType.STRING)
    private RoleType roleType;

    @Enumerated(EnumType.STRING)
    private LoginType loginType;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "profile_id")
    private Profile profile;

    // methods
    public void updateEmail(String email) {
        this.email = email;
    }

    public void updatePassword(String password) {
        this.password = password;
    }

    public void setProfile(Profile profile) {
        if (profile == null) {
            removeProfile();
            return;
        }

        this.profile = profile;
        if (profile.getAccount() != this) {
            profile.setAccount(this);
        }
    }

    public void removeProfile() {
        if (this.profile != null) {
            Profile temp = this.profile;
            this.profile = null;
            if (temp.getAccount() == this) {
                temp.removeAccount();
            }
        }
    }
}
