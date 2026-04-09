package com.valuehomes.service;

import com.valuehomes.model.PersonalizedPlan;
import com.valuehomes.model.PropertySubmission;
import com.valuehomes.model.Recommendation;
import com.valuehomes.repository.DataStore;

import java.io.IOException;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

public class RecommendationService {
    private final DataStore dataStore;

    public RecommendationService(DataStore dataStore) {
        this.dataStore = dataStore;
    }

    public List<Recommendation> allRecommendations() throws IOException {
        return dataStore.getRecommendations();
    }

    public void addRecommendation(String title, String category, String investmentLevel, int impactScore, String suitableFor, String description, String benefits) throws IOException {
        dataStore.saveRecommendation(new Recommendation(
                dataStore.newId(),
                title.trim(),
                category.trim(),
                investmentLevel.trim(),
                impactScore,
                suitableFor.trim(),
                description.trim(),
                benefits.trim()
        ));
    }

    public void deleteRecommendation(String id) throws IOException {
        dataStore.deleteRecommendation(id);
    }

    public PersonalizedPlan buildPlan(PropertySubmission submission) throws IOException {
        List<Recommendation> ranked = dataStore.getRecommendations().stream()
                .sorted(Comparator.comparingInt((Recommendation rec) -> score(rec, submission)).reversed()
                        .thenComparingInt(Recommendation::impactScore).reversed())
                .limit(3)
                .toList();

        int projectedBoost = ranked.stream()
                .mapToInt(rec -> Math.max(4, rec.impactScore() / 12))
                .sum();

        String summary = "For a " + submission.bhk() + " BHK " + submission.propertyType().toLowerCase(Locale.ENGLISH)
                + " in " + submission.city() + ", focus on high-trust upgrades that fit a budget of Rs "
                + submission.budgetLakhs() + " lakhs and directly address " + summarizeIssues(submission.currentIssues()) + ".";

        return new PersonalizedPlan(submission, ranked, summary, projectedBoost);
    }

    private int score(Recommendation recommendation, PropertySubmission submission) {
        int score = recommendation.impactScore();
        String combined = (submission.priorities() + " " + submission.currentIssues()).toLowerCase(Locale.ENGLISH);
        String title = (recommendation.title() + " " + recommendation.category() + " " + recommendation.description() + " " + recommendation.benefits()).toLowerCase(Locale.ENGLISH);

        if (combined.contains("kitchen") && title.contains("kitchen")) score += 20;
        if (combined.contains("bathroom") && title.contains("bathroom")) score += 20;
        if (combined.contains("balcony") && title.contains("balcony")) score += 20;
        if (combined.contains("paint") && title.contains("paint")) score += 16;
        if (combined.contains("electricity") && title.contains("energy")) score += 18;
        if (submission.propertyType().equalsIgnoreCase("Independent House") && recommendation.suitableFor().toLowerCase(Locale.ENGLISH).contains("independent")) score += 14;
        if (submission.propertyType().equalsIgnoreCase("Apartment") && recommendation.suitableFor().toLowerCase(Locale.ENGLISH).contains("flat")) score += 14;
        if (submission.budgetLakhs() <= 60 && recommendation.investmentLevel().equalsIgnoreCase("Low")) score += 18;
        if (submission.budgetLakhs() > 60 && recommendation.investmentLevel().equalsIgnoreCase("Medium")) score += 12;
        if (submission.budgetLakhs() > 85 && recommendation.investmentLevel().equalsIgnoreCase("High")) score += 10;
        return score;
    }

    private String summarizeIssues(String issues) {
        String trimmed = issues == null ? "" : issues.trim();
        if (trimmed.isEmpty()) {
            return "general value perception and buyer appeal";
        }
        String[] parts = trimmed.split("[,.]");
        return parts[0].trim().toLowerCase(Locale.ENGLISH);
    }
}
