package com.valuehomes.model;

public record PropertySubmission(
        String id,
        String ownerName,
        String city,
        String propertyType,
        int bhk,
        int budgetLakhs,
        String priorities,
        String currentIssues,
        String createdAt
) {
}
