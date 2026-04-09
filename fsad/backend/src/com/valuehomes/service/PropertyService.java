package com.valuehomes.service;

import com.valuehomes.model.PropertyListing;
import com.valuehomes.model.PropertySubmission;
import com.valuehomes.repository.DataStore;

import java.io.IOException;
import java.util.List;

public class PropertyService {
    private final DataStore dataStore;

    public PropertyService(DataStore dataStore) {
        this.dataStore = dataStore;
    }

    public List<PropertyListing> allListings() throws IOException {
        return dataStore.getListings();
    }

    public List<PropertySubmission> allSubmissions() throws IOException {
        return dataStore.getSubmissions();
    }

    public void addListing(String headline, String city, String area, String propertyType, int bhk, int budgetLakhs, String status) throws IOException {
        dataStore.saveListing(new PropertyListing(
                dataStore.newId(),
                headline.trim(),
                city.trim(),
                area.trim(),
                propertyType.trim(),
                bhk,
                budgetLakhs,
                status.trim()
        ));
    }

    public void deleteListing(String id) throws IOException {
        dataStore.deleteListing(id);
    }

    public PropertySubmission createSubmission(String ownerName, String city, String propertyType, int bhk, int budgetLakhs, String priorities, String currentIssues) throws IOException {
        PropertySubmission submission = new PropertySubmission(
                dataStore.newId(),
                ownerName.trim(),
                city.trim(),
                propertyType.trim(),
                bhk,
                budgetLakhs,
                priorities.trim(),
                currentIssues.trim(),
                dataStore.now()
        );
        dataStore.saveSubmission(submission);
        return submission;
    }
}
