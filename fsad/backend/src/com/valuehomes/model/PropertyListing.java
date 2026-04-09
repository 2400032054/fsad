package com.valuehomes.model;

public record PropertyListing(
        String id,
        String headline,
        String city,
        String area,
        String propertyType,
        int bhk,
        int budgetLakhs,
        String status
) {
}
