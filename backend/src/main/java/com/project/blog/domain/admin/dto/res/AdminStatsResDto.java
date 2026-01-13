package com.project.blog.domain.admin.dto.res;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdminStatsResDto {
    private Long totalAccounts;
    private Long activeAccounts;
    private Long deactivatedAccounts;
    private Long totalPosts;
    private Long publicPosts;
    private Long privatePosts;
    private Long totalComments;
    private Long totalCategories;
    private Long totalTags;
}
