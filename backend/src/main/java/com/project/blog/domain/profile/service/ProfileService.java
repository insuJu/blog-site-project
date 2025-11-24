package com.project.blog.domain.profile.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.blog.domain.account.entity.Account;
import com.project.blog.domain.account.repository.AccountRepository;
import com.project.blog.domain.profile.dto.req.BlogNameUpdateReqDto;
import com.project.blog.domain.profile.dto.req.NicknameUpdateReqDto;
import com.project.blog.domain.profile.entity.Profile;
import com.project.blog.domain.profile.repository.ProfileRepository;
import com.project.blog.global.error.code.ErrorCode;
import com.project.blog.global.error.exception.BusinessException;
import com.project.blog.global.error.util.ErrorUtil;
import com.project.blog.global.security.service.AuthenticatedUser;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileService {

        private final ProfileRepository profileRepository;
        private final AccountRepository accountRepository;

        public Profile createProfile(String nickname) {
                Map<String, String> errors = new HashMap<>();

                ErrorUtil.addErrorIf(errors, profileRepository.existsByNickname(nickname), "nickname",
                                () -> ErrorCode.DUPLICATE_NICKNAME.getMessage());

                ErrorUtil.throwIfNotEmpty(errors);

                Profile profile = Profile.builder()
                                .nickname(nickname)
                                .blogName(nickname + "의 블로그")
                                .build();

                return profileRepository.save(profile);
        }

        @Transactional
        public void updateNickname(NicknameUpdateReqDto reqDto, AuthenticatedUser authenticatedUser) {
                Account account = findAccountById(authenticatedUser.getAccount().getId());
                Profile profile = account.getProfile();
                if (profile == null)
                        throw new BusinessException(ErrorCode.PROFILE_NOT_FOUND);

                String newNickname = reqDto.getNewNickname();
                Map<String, String> errors = new HashMap<>();

                ErrorUtil.addErrorIf(errors, profile.getNickname().equals(newNickname), "newNickname",
                                () -> ErrorCode.SAME_NICKNAME.getMessage());
                ErrorUtil.addErrorIf(errors, profileRepository.existsByNickname(newNickname), "newNickname",
                                () -> ErrorCode.DUPLICATE_NICKNAME.getMessage());

                ErrorUtil.throwIfNotEmpty(errors);

                profile.updateNickname(newNickname);
        }

        @Transactional
        public void updateBlogName(BlogNameUpdateReqDto reqDto, AuthenticatedUser authenticatedUser) {
                Account account = findAccountById(authenticatedUser.getAccount().getId());
                Profile profile = account.getProfile();
                if (profile == null)
                        throw new BusinessException(ErrorCode.PROFILE_NOT_FOUND);

                String newBlogName = reqDto.getNewBlogName();
                Map<String, String> errors = new HashMap<>();

                ErrorUtil.addErrorIf(errors, profile.getBlogName().equals(newBlogName), "newBlogName",
                                () -> ErrorCode.SAME_BLOGNAME.getMessage());
                ErrorUtil.addErrorIf(errors, profileRepository.existsByBlogName(newBlogName), "newBlogName",
                                () -> ErrorCode.DUPLICATE_BLOGNAME.getMessage());

                ErrorUtil.throwIfNotEmpty(errors);

                profile.updateBlogName(newBlogName);
        }

        private Account findAccountById(int accountId) {
                return accountRepository.findById(accountId)
                                .orElseThrow(() -> new BusinessException(ErrorCode.ACCOUNT_NOT_FOUND));
        }
}
