package com.valuehomes.model;

import java.util.List;

public record PersonalizedPlan(
        PropertySubmission submission,
        List<Recommendation> recommendations,
        String summary,
        int projectedValueBoost
) {
}
