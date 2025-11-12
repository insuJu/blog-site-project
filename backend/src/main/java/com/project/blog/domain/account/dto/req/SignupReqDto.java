package com.project.blog.domain.account.dto.req;

import static com.project.blog.global.validation.ValidationConstants.*;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class SignupReqDto {

    @NotBlank(message = MSG_USERNAME_REQUIRED)
    @Size(min = USERNAME_MIN_LENGTH, max = USERNAME_MAX_LENGTH, message = MSG_USERNAME_SIZE)
    @Pattern(regexp = USERNAME_PATTERN, message = MSG_USERNAME_FORMAT)
    @Pattern(regexp = NO_SPACE_PATTERN, message = MSG_USERNAME_NO_SPACE)
    @Pattern(regexp = NO_HANGUL_PATTERN, message = MSG_USERNAME_NO_HANGUL)
    private String username;

    @NotBlank(message = MSG_PASSWORD_REQUIRED)
    @Size(min = PASSWORD_MIN_LENGTH, max = PASSWORD_MAX_LENGTH, message = MSG_PASSWORD_SIZE)
    @Pattern(regexp = PASSWORD_PATTERN, message = MSG_PASSWORD_FORMAT)
    @Pattern(regexp = NO_SPACE_PATTERN, message = MSG_PASSWORD_NO_SPACE)
    @Pattern(regexp = NO_HANGUL_PATTERN, message = MSG_PASSWORD_NO_HANGUL)
    private String password;

    @NotBlank(message = MSG_EMAIL_REQUIRED)
    @Size(max = EMAIL_MAX_LENGTH, message = MSG_EMAIL_SIZE)
    @Pattern(regexp = EMAIL_PATTERN, message = MSG_EMAIL_FORMAT)
    @Pattern(regexp = NO_SPACE_PATTERN, message = MSG_EMAIL_NO_SPACE)
    private String email;
}
