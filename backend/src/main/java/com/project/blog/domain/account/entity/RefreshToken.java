package com.project.blog.domain.account.entity;

import java.time.LocalDateTime;

import com.project.blog.global.entity.BaseTimeEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
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
public class RefreshToken extends BaseTimeEntity {
    // fields
    @Id
    private Integer accountId;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id",
                nullable = false,
                foreignKey = @ForeignKey(
                    name = "fk_refresh_token_account",
                    foreignKeyDefinition = "FOREIGN KEY (account_id) REFERENCES account(id) ON DELETE CASCADE"
                ))
    private Account account;

    @Column(nullable = false, unique = true, length = 64)
    private String tokenHash;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    // methods
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }

    public void update(String tokenHash, LocalDateTime expiresAt) {
    this.tokenHash = tokenHash;
    this.expiresAt = expiresAt;
}
}
