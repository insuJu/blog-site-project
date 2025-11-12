package com.project.blog.domain.account.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.blog.domain.account.entity.Account;

public interface AccountRepository extends JpaRepository<Account, Integer> {
    Optional<Account> findByUsername(String username);

    Optional<Account> findByEmail(String email);
}
