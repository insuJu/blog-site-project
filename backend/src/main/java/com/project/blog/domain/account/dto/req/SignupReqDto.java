package com.project.blog.domain.account.dto.req;

import static com.project.blog.global.validation.ValidationConstants.*;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SignupReqDto {

    @NotBlank(message = MSG_USERNAME_REQUIRED)
    @Pattern(regexp = USERNAME_PATTERN, message = MSG_USERNAME_FORMAT)
    @Pattern(regexp = NO_SPACE_PATTERN, message = MSG_USERNAME_NO_SPACE)
    @Pattern(regexp = NO_HANGUL_PATTERN, message = MSG_USERNAME_NO_HANGUL)
    private String username;

    @NotBlank(message = MSG_PASSWORD_REQUIRED)
    @Pattern(regexp = PASSWORD_PATTERN, message = MSG_PASSWORD_FORMAT)
    @Pattern(regexp = NO_SPACE_PATTERN, message = MSG_PASSWORD_NO_SPACE)
    @Pattern(regexp = NO_HANGUL_PATTERN, message = MSG_PASSWORD_NO_HANGUL)
    private String password;

    @NotBlank(message = MSG_EMAIL_REQUIRED)
    @Pattern(regexp = EMAIL_PATTERN, message = MSG_EMAIL_FORMAT)
    @Pattern(regexp = NO_SPACE_PATTERN, message = MSG_EMAIL_NO_SPACE)
    private String email;

    @NotBlank(message = MSG_NICKNAME_REQUIRED)
    @Pattern(regexp = NICKNAME_PATTERN, message = MSG_NICKNAME_FORMAT)
    @Pattern(regexp = NO_SPACE_PATTERN, message = MSG_NICKNAME_NO_SPACE)
    private String nickname;

    @NotBlank(message = MSG_VERIFICATION_CODE_REQUIRED)
    @Pattern(regexp = VERIFICATION_CODE_PATTERN, message = MSG_VERIFICATION_CODE_FORMAT)
    private String verificationCode;
}
