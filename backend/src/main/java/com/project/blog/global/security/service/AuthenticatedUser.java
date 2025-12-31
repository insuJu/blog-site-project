package com.project.blog.global.security.service;

import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.project.blog.domain.account.entity.Account;
import com.project.blog.domain.account.enums.RoleType;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthenticatedUser implements UserDetails {

    private Account account;
    private Map<String, Object> attributes;
    private String loginMethod;

    public AuthenticatedUser(Account account) {
        this.account = account;
        this.attributes = Map.of();
        this.loginMethod = "LOCAL";
    }

    public AuthenticatedUser(Account account, Map<String, Object> attributes) {
        this.account = account;
        this.attributes = attributes;
        this.loginMethod = "LOCAL";
    }

    @Override
    public String getPassword() {
        return account.getPassword();
    }

    @Override
    public String getUsername() {
        return account.getUsername();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        RoleType role = account.getRoleType();
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
