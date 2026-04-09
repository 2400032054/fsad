package com.valuehomes.repository;

import com.valuehomes.model.PropertyListing;
import com.valuehomes.model.PropertySubmission;
import com.valuehomes.model.Recommendation;
import com.valuehomes.util.CsvUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public class DataStore {
    private final Path recommendationsFile;
    private final Path listingsFile;
    private final Path submissionsFile;

    public DataStore(Path dataDir) throws IOException {
        Files.createDirectories(dataDir);
        this.recommendationsFile = dataDir.resolve("recommendations.csv");
        this.listingsFile = dataDir.resolve("listings.csv");
        this.submissionsFile = dataDir.resolve("submissions.csv");
        bootstrap();
    }

    private void bootstrap() throws IOException {
        if (Files.notExists(recommendationsFile)) {
            List<List<String>> rows = new ArrayList<>();
            rows.add(List.of("id", "title", "category", "investmentLevel", "impactScore", "suitableFor", "description", "benefits"));
            rows.add(List.of(newId(), "Kitchen Refresh", "Interior Upgrade", "Medium", "90", "Apartments and compact villas", "Upgrade laminates, lighting, and modular storage to make the home look newer and more functional.", "Higher buyer appeal;Better storage;Premium finish"));
            rows.add(List.of(newId(), "Balcony Utility Conversion", "Space Optimization", "Low", "78", "Urban flats", "Turn underused balconies into work-from-home or utility corners with weather-safe finishes.", "Better usable area;Modern lifestyle fit;Low renovation cost"));
            rows.add(List.of(newId(), "Bathroom Modernization", "Essential Upgrade", "Medium", "88", "All middle-class homes", "Replace dated tiles, fittings, mirrors, and ventilation for a cleaner and more hygienic look.", "Improves resale trust;Modern appearance;Lower maintenance"));
            rows.add(List.of(newId(), "Exterior Paint and Gate Upgrade", "Curb Appeal", "Low", "74", "Independent houses", "Refresh street-facing walls, gate paint, and entrance lighting for a stronger first impression.", "Better first impression;Low cost uplift;Neighborhood standout"));
            rows.add(List.of(newId(), "Solar and Energy Saving Package", "Sustainability", "High", "84", "Sun-exposed properties", "Add solar lighting, efficient fans, and inverter-ready electrical planning to reduce long-term cost.", "Lower bills;Future-ready home;Eco-friendly branding"));
            CsvUtils.writeRows(recommendationsFile, rows);
        }

        if (Files.notExists(listingsFile)) {
            List<List<String>> rows = new ArrayList<>();
            rows.add(List.of("id", "headline", "city", "area", "propertyType", "bhk", "budgetLakhs", "status"));
            rows.add(List.of(newId(), "2 BHK apartment near metro corridor", "Bengaluru", "Whitefield", "Apartment", "2", "68", "Active"));
            rows.add(List.of(newId(), "3 BHK family home with terrace potential", "Pune", "Wakad", "Independent House", "3", "92", "Active"));
            rows.add(List.of(newId(), "Budget-friendly resale flat for first-time buyers", "Hyderabad", "Miyapur", "Apartment", "2", "56", "Featured"));
            CsvUtils.writeRows(listingsFile, rows);
        }

        if (Files.notExists(submissionsFile)) {
            CsvUtils.writeRows(submissionsFile, List.of(List.of("id", "ownerName", "city", "propertyType", "bhk", "budgetLakhs", "priorities", "currentIssues", "createdAt")));
        }
    }

    public synchronized List<Recommendation> getRecommendations() throws IOException {
        return CsvUtils.readAsMaps(recommendationsFile).stream()
                .map(row -> new Recommendation(
                        row.get("id"),
                        row.get("title"),
                        row.get("category"),
                        row.get("investmentLevel"),
                        Integer.parseInt(row.get("impactScore")),
                        row.get("suitableFor"),
                        row.get("description"),
                        row.get("benefits")))
                .sorted(Comparator.comparingInt(Recommendation::impactScore).reversed())
                .toList();
    }

    public synchronized void saveRecommendation(Recommendation recommendation) throws IOException {
        List<Map<String, String>> existing = new ArrayList<>(CsvUtils.readAsMaps(recommendationsFile));
        existing.add(Map.of(
                "id", recommendation.id(),
                "title", recommendation.title(),
                "category", recommendation.category(),
                "investmentLevel", recommendation.investmentLevel(),
                "impactScore", String.valueOf(recommendation.impactScore()),
                "suitableFor", recommendation.suitableFor(),
                "description", recommendation.description(),
                "benefits", recommendation.benefits()
        ));
        CsvUtils.writeMaps(recommendationsFile, List.of("id", "title", "category", "investmentLevel", "impactScore", "suitableFor", "description", "benefits"), existing);
    }

    public synchronized void deleteRecommendation(String id) throws IOException {
        List<Map<String, String>> remaining = CsvUtils.readAsMaps(recommendationsFile).stream()
                .filter(row -> !row.get("id").equals(id))
                .toList();
        CsvUtils.writeMaps(recommendationsFile, List.of("id", "title", "category", "investmentLevel", "impactScore", "suitableFor", "description", "benefits"), remaining);
    }

    public synchronized List<PropertyListing> getListings() throws IOException {
        return CsvUtils.readAsMaps(listingsFile).stream()
                .map(row -> new PropertyListing(
                        row.get("id"),
                        row.get("headline"),
                        row.get("city"),
                        row.get("area"),
                        row.get("propertyType"),
                        Integer.parseInt(row.get("bhk")),
                        Integer.parseInt(row.get("budgetLakhs")),
                        row.get("status")))
                .sorted(Comparator.comparing(PropertyListing::status))
                .toList();
    }

    public synchronized void saveListing(PropertyListing listing) throws IOException {
        List<Map<String, String>> existing = new ArrayList<>(CsvUtils.readAsMaps(listingsFile));
        existing.add(Map.of(
                "id", listing.id(),
                "headline", listing.headline(),
                "city", listing.city(),
                "area", listing.area(),
                "propertyType", listing.propertyType(),
                "bhk", String.valueOf(listing.bhk()),
                "budgetLakhs", String.valueOf(listing.budgetLakhs()),
                "status", listing.status()
        ));
        CsvUtils.writeMaps(listingsFile, List.of("id", "headline", "city", "area", "propertyType", "bhk", "budgetLakhs", "status"), existing);
    }

    public synchronized void deleteListing(String id) throws IOException {
        List<Map<String, String>> remaining = CsvUtils.readAsMaps(listingsFile).stream()
                .filter(row -> !row.get("id").equals(id))
                .toList();
        CsvUtils.writeMaps(listingsFile, List.of("id", "headline", "city", "area", "propertyType", "bhk", "budgetLakhs", "status"), remaining);
    }

    public synchronized void saveSubmission(PropertySubmission submission) throws IOException {
        List<Map<String, String>> existing = new ArrayList<>(CsvUtils.readAsMaps(submissionsFile));
        existing.add(Map.of(
                "id", submission.id(),
                "ownerName", submission.ownerName(),
                "city", submission.city(),
                "propertyType", submission.propertyType(),
                "bhk", String.valueOf(submission.bhk()),
                "budgetLakhs", String.valueOf(submission.budgetLakhs()),
                "priorities", submission.priorities(),
                "currentIssues", submission.currentIssues(),
                "createdAt", submission.createdAt()
        ));
        CsvUtils.writeMaps(submissionsFile, List.of("id", "ownerName", "city", "propertyType", "bhk", "budgetLakhs", "priorities", "currentIssues", "createdAt"), existing);
    }

    public synchronized List<PropertySubmission> getSubmissions() throws IOException {
        return CsvUtils.readAsMaps(submissionsFile).stream()
                .map(row -> new PropertySubmission(
                        row.get("id"),
                        row.get("ownerName"),
                        row.get("city"),
                        row.get("propertyType"),
                        Integer.parseInt(row.get("bhk")),
                        Integer.parseInt(row.get("budgetLakhs")),
                        row.get("priorities"),
                        row.get("currentIssues"),
                        row.get("createdAt")))
                .sorted(Comparator.comparing(PropertySubmission::createdAt).reversed())
                .toList();
    }

    public String newId() {
        return UUID.randomUUID().toString().substring(0, 8);
    }

    public String now() {
        return LocalDateTime.now().withNano(0).toString();
    }
}
