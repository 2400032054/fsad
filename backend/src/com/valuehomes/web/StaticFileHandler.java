package com.valuehomes.web;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.nio.file.Files;
import java.nio.file.Path;

public class StaticFileHandler implements HttpHandler {
    private final Path publicDir;

    public StaticFileHandler(Path publicDir) {
        this.publicDir = publicDir;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String relative = exchange.getRequestURI().getPath().replaceFirst("/assets/", "");
        Path file = publicDir.resolve(relative).normalize();
        if (!file.startsWith(publicDir) || Files.notExists(file)) {
            exchange.sendResponseHeaders(HttpURLConnection.HTTP_NOT_FOUND, -1);
            exchange.close();
            return;
        }

        String contentType = file.toString().endsWith(".css") ? "text/css; charset=UTF-8" : "application/javascript; charset=UTF-8";
        byte[] bytes = Files.readAllBytes(file);
        exchange.getResponseHeaders().set("Content-Type", contentType);
        exchange.sendResponseHeaders(HttpURLConnection.HTTP_OK, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        } finally {
            exchange.close();
        }
    }
}
