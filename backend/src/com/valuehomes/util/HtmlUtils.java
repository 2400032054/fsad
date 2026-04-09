package com.valuehomes.util;

public final class HtmlUtils {
    private HtmlUtils() {
    }

    public static String escape(String input) {
        if (input == null) {
            return "";
        }
        return input
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;");
    }
}
