package com.valuehomes.web;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.valuehomes.model.PersonalizedPlan;
import com.valuehomes.model.PropertySubmission;
import com.valuehomes.service.PropertyService;
import com.valuehomes.service.RecommendationService;

import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.nio.charset.StandardCharsets;
import java.util.Map;

public class AppHandler implements HttpHandler {
    private final RecommendationService recommendationService;
    private final PropertyService propertyService;
    private final PageRenderer renderer = new PageRenderer();

    public AppHandler(RecommendationService recommendationService, PropertyService propertyService) {
        this.recommendationService = recommendationService;
        this.propertyService = propertyService;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        try {
            String path = exchange.getRequestURI().getPath();
            String method = exchange.getRequestMethod();

            if ("GET".equalsIgnoreCase(method) && "/".equals(path)) {
                renderHome(exchange, null, null);
                return;
            }

            if ("POST".equalsIgnoreCase(method) && "/admin/recommendations".equals(path)) {
                Map<String, String> form = FormData.parse(exchange.getRequestBody());
                recommendationService.addRecommendation(
                        form.getOrDefault("title", ""),
                        form.getOrDefault("category", ""),
                        form.getOrDefault("investmentLevel", "Low"),
                        Integer.parseInt(form.getOrDefault("impactScore", "50")),
                        form.getOrDefault("suitableFor", ""),
                        form.getOrDefault("description", ""),
                        form.getOrDefault("benefits", "")
                );
                renderHome(exchange, null, "Recommendation saved successfully.");
                return;
            }

            if ("POST".equalsIgnoreCase(method) && "/admin/recommendations/delete".equals(path)) {
                Map<String, String> form = FormData.parse(exchange.getRequestBody());
                recommendationService.deleteRecommendation(form.getOrDefault("id", ""));
                renderHome(exchange, null, "Recommendation removed.");
                return;
            }

            if ("POST".equalsIgnoreCase(method) && "/admin/listings".equals(path)) {
                Map<String, String> form = FormData.parse(exchange.getRequestBody());
                propertyService.addListing(
                        form.getOrDefault("headline", ""),
                        form.getOrDefault("city", ""),
                        form.getOrDefault("area", ""),
                        form.getOrDefault("propertyType", ""),
                        Integer.parseInt(form.getOrDefault("bhk", "2")),
                        Integer.parseInt(form.getOrDefault("budgetLakhs", "50")),
                        form.getOrDefault("status", "Active")
                );
                renderHome(exchange, null, "Listing saved successfully.");
                return;
            }

            if ("POST".equalsIgnoreCase(method) && "/admin/listings/delete".equals(path)) {
                Map<String, String> form = FormData.parse(exchange.getRequestBody());
                propertyService.deleteListing(form.getOrDefault("id", ""));
                renderHome(exchange, null, "Listing removed.");
                return;
            }

            if ("POST".equalsIgnoreCase(method) && "/user/submit".equals(path)) {
                Map<String, String> form = FormData.parse(exchange.getRequestBody());
                PropertySubmission submission = propertyService.createSubmission(
                        form.getOrDefault("ownerName", ""),
                        form.getOrDefault("city", ""),
                        form.getOrDefault("propertyType", "Apartment"),
                        Integer.parseInt(form.getOrDefault("bhk", "2")),
                        Integer.parseInt(form.getOrDefault("budgetLakhs", "50")),
                        form.getOrDefault("priorities", ""),
                        form.getOrDefault("currentIssues", "")
                );
                PersonalizedPlan plan = recommendationService.buildPlan(submission);
                renderHome(exchange, plan, "Personalized recommendations generated.");
                return;
            }

            sendResponse(exchange, HttpURLConnection.HTTP_NOT_FOUND, "Not found", "text/plain");
        } catch (Exception exception) {
            sendResponse(exchange, HttpURLConnection.HTTP_INTERNAL_ERROR, "Application error: " + exception.getMessage(), "text/plain");
        } finally {
            exchange.close();
        }
    }

    private void renderHome(HttpExchange exchange, PersonalizedPlan plan, String flashMessage) throws IOException {
        String html = renderer.renderHome(
                recommendationService.allRecommendations(),
                propertyService.allListings(),
                propertyService.allSubmissions(),
                plan,
                flashMessage
        );
        sendResponse(exchange, HttpURLConnection.HTTP_OK, html, "text/html; charset=UTF-8");
    }

    private void sendResponse(HttpExchange exchange, int statusCode, String body, String contentType) throws IOException {
        byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", contentType);
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }
}
