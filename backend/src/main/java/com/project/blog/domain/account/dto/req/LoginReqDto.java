package com.project.blog.domain.account.dto.req;

import static com.project.blog.global.validation.ValidationConstants.*;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class LoginReqDto {

    @NotBlank(message = MSG_USERNAME_REQUIRED)
    private String username;

    @NotBlank(message = MSG_PASSWORD_REQUIRED)
    private String password;
}
