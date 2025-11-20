package com.project.blog.domain.profile.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.blog.domain.account.entity.Account;
import com.project.blog.domain.profile.dto.req.BlogNameUpdateReqDto;
import com.project.blog.domain.profile.dto.req.NicknameUpdateReqDto;
import com.project.blog.domain.profile.entity.Profile;
import com.project.blog.domain.profile.repository.ProfileRepository;
import com.project.blog.global.error.code.ErrorCode;
import com.project.blog.global.error.exception.BusinessException;
import com.project.blog.global.error.exception.InputBusinessException;
import com.project.blog.global.security.service.AuthenticatedUser;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;
    
    public Profile createProfile(String nickname) {
        if (profileRepository.existsByNickname(nickname)) {
            Map<String, String> errors = new HashMap<>();
            errors.put("nickname", ErrorCode.DUPLICATE_NICKNAME.getMessage());
            throw new InputBusinessException(ErrorCode.INPUT_BUSINESS_ERROR, errors);
        }

        Profile profile = Profile.builder()
                .nickname(nickname)
                .blogName(nickname + "의 블로그")
                .build();

        return profileRepository.save(profile);
    }

    @Transactional
    public void updateNickname(NicknameUpdateReqDto reqDto, AuthenticatedUser authenticatedUser) {
        Account account = authenticatedUser.getAccount();
        Profile profile = account.getProfile();

        if (profile == null) {
            throw new BusinessException(ErrorCode.PROFILE_NOT_FOUND);
        }

        String newNickname = reqDto.getNewNickname();

        if (profile.getNickname().equals(newNickname)) {
            return;
        }

        if (profileRepository.existsByNickname(newNickname)) {
            Map<String, String> errors = new HashMap<>();
            errors.put("newNickname", ErrorCode.DUPLICATE_NICKNAME.getMessage());
            throw new InputBusinessException(ErrorCode.INPUT_BUSINESS_ERROR, errors);
        }

        Profile managedProfile = findProfileById(profile.getId());
        managedProfile.updateNickname(newNickname);
    }

    @Transactional
    public void updateBlogName(BlogNameUpdateReqDto reqDto, AuthenticatedUser authenticatedUser) {
        Account account = authenticatedUser.getAccount();
        Profile profile = account.getProfile();

        if (profile == null) {
            throw new BusinessException(ErrorCode.PROFILE_NOT_FOUND);
        }

        String newBlogName = reqDto.getNewBlogName();

        if (profile.getBlogName().equals(newBlogName)) {
            return;
        }

        if (profileRepository.existsByBlogName(newBlogName)) {
            Map<String, String> errors = new HashMap<>();
            errors.put("newBlogName", ErrorCode.DUPLICATE_BLOGNAME.getMessage());
            throw new InputBusinessException(ErrorCode.INPUT_BUSINESS_ERROR, errors);
        }

        Profile managedProfile = findProfileById(profile.getId());
        managedProfile.updateBlogName(newBlogName);
    }

    private Profile findProfileById(int profileId) {
        return profileRepository.findById(profileId)
                .orElseThrow(() -> new BusinessException(ErrorCode.PROFILE_NOT_FOUND));
    }
}
