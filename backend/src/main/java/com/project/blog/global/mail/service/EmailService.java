package com.project.blog.global.mail.service;

import org.springframework.stereotype.Service;

import com.project.blog.global.mail.enums.EmailType;
import com.project.blog.global.mail.sender.EmailSender;
import com.project.blog.global.mail.template.EmailTemplate;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final EmailSender emailSender;

    public void sendVerificationCode(String to, String code, EmailType type) {
        String subject = String.format("[쭈로그] %s 인증코드", getSubjectSuffix(type));
        String content = EmailTemplate.buildVerificationCodeEmail(code, type);
        sendEmail(to, subject, content);
    }

    public void sendUsername(String to, String username) {
        String subject = "[쭈로그] 아이디 찾기 결과";
        String content = EmailTemplate.buildUsernameEmail(username);
        sendEmail(to, subject, content);
    }

    public void sendTemporaryPassword(String to, String tempPassword) {
        String subject = "[쭈로그] 임시 비밀번호 발급";
        String content = EmailTemplate.buildTemporaryPasswordEmail(tempPassword);
        sendEmail(to, subject, content);
    }

    private void sendEmail(String to, String subject, String content) {
        emailSender.sendEmail(to, subject, content);
    }

    private String getSubjectSuffix(EmailType type) {
        return switch (type) {
            case PASSWORD_RESET -> "비밀번호 재설정";
            case ACCOUNT_DELETION -> "회원탈퇴";
            case EMAIL_SIGNUP -> "회원가입";
        };
    }
}
