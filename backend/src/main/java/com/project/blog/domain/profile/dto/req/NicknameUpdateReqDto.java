package com.project.blog.domain.profile.dto.req;

import static com.project.blog.global.validation.ValidationConstants.*;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class NicknameUpdateReqDto {

    @NotBlank(message = MSG_NICKNAME_REQUIRED)
    @Size(min = NICKNAME_MIN_LENGTH, max = NICKNAME_MAX_LENGTH, message = MSG_NICKNAME_SIZE)
    @Pattern(regexp = NICKNAME_PATTERN, message = MSG_NICKNAME_FORMAT)
    private String newNickname;
}
