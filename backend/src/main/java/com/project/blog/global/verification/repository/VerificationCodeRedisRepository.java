package com.project.blog.global.verification.repository;

import java.util.Optional;
import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import com.project.blog.global.verification.enums.VerificationType;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class VerificationCodeRedisRepository {

    private final RedisTemplate<String, String> redisTemplate;
    private static final String KEY_PREFIX = "verification_code:";
    private static final long EXPIRATION_SECONDS = 300;

    public void save(String identifier, VerificationType type, String code) {
        String key = generateKey(identifier, type);
        redisTemplate.opsForValue().set(key, code, EXPIRATION_SECONDS, TimeUnit.SECONDS);
    }

    public Optional<String> findByIdentifierAndType(String identifier, VerificationType type) {
        String key = generateKey(identifier, type);
        String code = redisTemplate.opsForValue().get(key);
        return Optional.ofNullable(code);
    }

    public void deleteByIdentifierAndType(String identifier, VerificationType type) {
        String key = generateKey(identifier, type);
        redisTemplate.delete(key);
    }

    private String generateKey(String identifier, VerificationType type) {
        return KEY_PREFIX + type.name().toLowerCase() + ":" + identifier;
    }
}
