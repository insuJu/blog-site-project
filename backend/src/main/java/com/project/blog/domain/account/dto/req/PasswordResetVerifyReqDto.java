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
public class PasswordResetVerifyReqDto {

    @NotBlank(message = MSG_USERNAME_REQUIRED)
    private String username;

    @NotBlank(message = MSG_VERIFICATION_CODE_REQUIRED)
    @Pattern(regexp = VERIFICATION_CODE_PATTERN, message = MSG_VERIFICATION_CODE_FORMAT)
    private String verificationCode;
}
