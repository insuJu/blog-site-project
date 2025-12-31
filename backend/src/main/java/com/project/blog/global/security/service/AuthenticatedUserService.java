package com.project.blog.global.security.service;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

import com.project.blog.domain.account.repository.AccountRepository;
import com.project.blog.global.error.code.ErrorCode;
import com.project.blog.global.error.exception.BusinessException;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AuthenticatedUserService implements UserDetailsService {

    private final AccountRepository accountRepository;

    @Override
    public AuthenticatedUser loadUserByUsername(String username) {
        return accountRepository.findByUsername(username)
                .map(AuthenticatedUser::new)
                .orElseThrow(() -> new BusinessException(ErrorCode.ACCOUNT_NOT_FOUND));
    }

    public AuthenticatedUser loadUserByUsername(String username, String loginMethod) {
        return accountRepository.findByUsername(username)
                .map(account -> new AuthenticatedUser(account, null, loginMethod))
                .orElseThrow(() -> new BusinessException(ErrorCode.ACCOUNT_NOT_FOUND));
    }
}
