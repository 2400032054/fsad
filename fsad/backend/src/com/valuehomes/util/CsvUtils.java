package com.valuehomes.util;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public final class CsvUtils {
    private CsvUtils() {
    }

    public static List<Map<String, String>> readAsMaps(Path file) throws IOException {
        List<String> lines = Files.readAllLines(file, StandardCharsets.UTF_8);
        if (lines.isEmpty()) {
            return List.of();
        }
        List<String> headers = parseLine(lines.get(0));
        List<Map<String, String>> rows = new ArrayList<>();
        for (int i = 1; i < lines.size(); i++) {
            if (lines.get(i).isBlank()) {
                continue;
            }
            List<String> values = parseLine(lines.get(i));
            Map<String, String> row = new LinkedHashMap<>();
            for (int j = 0; j < headers.size(); j++) {
                row.put(headers.get(j), j < values.size() ? values.get(j) : "");
            }
            rows.add(row);
        }
        return rows;
    }

    public static void writeRows(Path file, List<List<String>> rows) throws IOException {
        List<String> lines = rows.stream().map(CsvUtils::formatLine).toList();
        Files.write(file, lines, StandardCharsets.UTF_8);
    }

    public static void writeMaps(Path file, List<String> headers, List<Map<String, String>> rows) throws IOException {
        List<List<String>> data = new ArrayList<>();
        data.add(headers);
        for (Map<String, String> row : rows) {
            List<String> values = new ArrayList<>();
            for (String header : headers) {
                values.add(row.getOrDefault(header, ""));
            }
            data.add(values);
        }
        writeRows(file, data);
    }

    private static List<String> parseLine(String line) {
        List<String> values = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        boolean inQuotes = false;
        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);
            if (c == '"') {
                if (inQuotes && i + 1 < line.length() && line.charAt(i + 1) == '"') {
                    current.append('"');
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (c == ',' && !inQuotes) {
                values.add(current.toString());
                current.setLength(0);
            } else {
                current.append(c);
            }
        }
        values.add(current.toString());
        return values;
    }

    private static String formatLine(List<String> values) {
        List<String> escaped = values.stream().map(CsvUtils::escape).toList();
        return String.join(",", escaped);
    }

    private static String escape(String value) {
        String safe = value == null ? "" : value;
        if (safe.contains(",") || safe.contains("\"") || safe.contains("\n")) {
            return "\"" + safe.replace("\"", "\"\"") + "\"";
        }
        return safe;
    }
}
