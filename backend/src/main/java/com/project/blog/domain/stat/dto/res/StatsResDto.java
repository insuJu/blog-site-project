package com.project.blog.domain.stat.dto.res;

import lombok.Builder;
import lombok.Getter;

@Getter
public class StatsResDto {
    private final long postCount;
    private final long commentCount;
    private final long viewCount;

    @Builder
    public StatsResDto(long postCount, long commentCount, long viewCount) {
        this.postCount = postCount;
        this.commentCount = commentCount;
        this.viewCount = viewCount;
    }
}
