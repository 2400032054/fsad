package com.valuehomes.model;

public record Recommendation(
        String id,
        String title,
        String category,
        String investmentLevel,
        int impactScore,
        String suitableFor,
        String description,
        String benefits
) {
}
