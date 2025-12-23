package com.project.blog.domain.account.dto.req;

import static com.project.blog.global.validation.ValidationConstants.*;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetRequestReqDto {

    @NotBlank(message = MSG_USERNAME_REQUIRED)
    private String username;

    @NotBlank(message = MSG_EMAIL_REQUIRED)
    private String email;
}
