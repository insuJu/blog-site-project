package com.project.blog.domain.stat.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.blog.domain.stat.dto.res.StatsResDto;
import com.project.blog.domain.stat.service.StatsService;
import com.project.blog.global.dto.ApiResDto;

import lombok.RequiredArgsConstructor;

@RequestMapping("/api/stats")
@RestController
@RequiredArgsConstructor
public class StatsController {
    private final StatsService statsService;

    @GetMapping
    public ResponseEntity<ApiResDto<StatsResDto>> getStats() {
        StatsResDto stats = statsService.getSiteStats();
        return ResponseEntity.ok(ApiResDto.<StatsResDto>builder()
                .data(stats)
                .build());
    }

   @GetMapping("/author/{authorId}")
   public ResponseEntity<ApiResDto<StatsResDto>> getAuthorStats(@PathVariable("authorId") Long authorId) {
            StatsResDto stats = statsService.getAuthorStats(authorId);
            return ResponseEntity.ok(ApiResDto.<StatsResDto>builder()
                    .data(stats)
                    .build());
    }     
}
