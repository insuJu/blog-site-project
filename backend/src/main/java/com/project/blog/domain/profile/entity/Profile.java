package com.project.blog.domain.profile.entity;

import com.project.blog.domain.account.entity.Account;
import com.project.blog.global.entity.BaseTimeEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
public class Profile extends BaseTimeEntity {
    // fields
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, unique = true, length = 20)
    private String nickname;

    @Column(nullable = false, unique = true, length = 30)
    private String blogName;

    private String avatarImageName;

    @OneToOne(mappedBy = "profile")
    private Account account;

    // methods
    public void updateNickname(String nickname) {
        this.nickname = nickname;
    }

    public void setAccount(Account account) {
        if (account == null) {
            removeAccount();
            return;
        }

        this.account = account;
        if (account.getProfile() != this) {
            account.setProfile(this);
        }
    }

    public void removeAccount() {
        if (this.account != null) {
            Account temp = this.account;
            this.account = null;
            if (temp.getProfile() == this) {
                temp.removeProfile();
            }
        }
    }
}
