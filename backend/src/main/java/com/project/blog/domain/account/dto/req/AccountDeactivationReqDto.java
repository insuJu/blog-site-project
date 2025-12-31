package com.project.blog.domain.account.dto.req;

import static com.project.blog.global.validation.ValidationConstants.*;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class AccountDeactivationReqDto {
    
    @NotBlank(message = MSG_PASSWORD_REQUIRED)
    private String password;
}
