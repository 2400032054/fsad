package com.valuehomes;

import com.sun.net.httpserver.HttpServer;
import com.valuehomes.repository.DataStore;
import com.valuehomes.service.PropertyService;
import com.valuehomes.service.RecommendationService;
import com.valuehomes.web.AppHandler;
import com.valuehomes.web.StaticFileHandler;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.file.Path;
import java.util.concurrent.Executors;

public class MainApp {
    public static void main(String[] args) throws IOException {
        Path root = Path.of("").toAbsolutePath();
        Path dataDir = root.resolve("backend").resolve("data");
        Path publicDir = root.resolve("frontend").resolve("public");

        DataStore dataStore = new DataStore(dataDir);
        RecommendationService recommendationService = new RecommendationService(dataStore);
        PropertyService propertyService = new PropertyService(dataStore);

        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        server.createContext("/", new AppHandler(recommendationService, propertyService));
        server.createContext("/assets/", new StaticFileHandler(publicDir));
        server.setExecutor(Executors.newFixedThreadPool(8));
        server.start();

        System.out.println("ValueHomes running on http://localhost:8080");
    }
}
