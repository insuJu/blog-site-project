package com.project.blog.global.mail.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.project.blog.global.error.code.ErrorCode;
import com.project.blog.global.error.exception.BusinessException;
import com.project.blog.global.mail.enums.EmailType;
import com.project.blog.global.mail.template.EmailTemplate;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromEmail;

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
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            log.error("Failed to send email to: {}", to, e);
            throw new BusinessException(ErrorCode.VERIFICATION_CODE_SEND_FAILED);
        }
    }

    private String getSubjectSuffix(EmailType type) {
        return switch (type) {
            case PASSWORD_RESET -> "비밀번호 재설정";
            case ACCOUNT_DELETION -> "회원탈퇴";
        };
    }
}
