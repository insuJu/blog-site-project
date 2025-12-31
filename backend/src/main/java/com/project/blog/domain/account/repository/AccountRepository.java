package com.project.blog.domain.account.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.blog.domain.account.entity.Account;
import com.project.blog.domain.account.enums.OAuth2Provider;

public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByUsername(String username);

    Optional<Account> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    Optional<Account> findByOauth2ProviderAndProviderId(OAuth2Provider oauth2Provider, String providerId);

    boolean existsByOauth2ProviderAndProviderId(OAuth2Provider oauth2Provider, String providerId);
}