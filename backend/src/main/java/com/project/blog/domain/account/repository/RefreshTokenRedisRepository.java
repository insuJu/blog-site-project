package com.project.blog.domain.account.repository;

import java.util.Optional;
import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class RefreshTokenRedisRepository {

    private final RedisTemplate<String, String> redisTemplate;
    private static final String KEY_PREFIX = "refresh_token:";

    public void save(Long accountId, String tokenHash, long expirationSeconds) {
        String key = generateKey(accountId);
        redisTemplate.opsForValue().set(key, tokenHash, expirationSeconds, TimeUnit.SECONDS);
    }

    public Optional<String> findByAccountId(Long accountId) {
        String key = generateKey(accountId);
        String tokenHash = redisTemplate.opsForValue().get(key);
        return Optional.ofNullable(tokenHash);
    }

    public void deleteByAccountId(Long accountId) {
        String key = generateKey(accountId);
        redisTemplate.delete(key);
    }

    private String generateKey(Long accountId) {
        return KEY_PREFIX + accountId;
    }
}
