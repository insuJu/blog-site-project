package com.project.blog.global.mail.sender;

public interface EmailSender {
    void sendEmail(String to, String subject, String htmlContent);
}
