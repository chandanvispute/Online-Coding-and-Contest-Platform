package com.codeplatform.backend.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.Map;

public class JsonUtil {
    private static final ObjectMapper objectMapper = new ObjectMapper();
    
    public static String toJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting to JSON", e);
        }
    }
    
    public static <T> T fromJson(String json, Class<T> clazz) {
        try {
            return objectMapper.readValue(json, clazz);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error parsing JSON", e);
        }
    }
    
    public static <T> T fromJson(String json, TypeReference<T> typeRef) {
        try {
            return objectMapper.readValue(json, typeRef);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error parsing JSON", e);
        }
    }
    
    public static List<Map<String, String>> parseTestCases(String json) {
        if (json == null || json.trim().isEmpty()) {
            return List.of();
        }
        return fromJson(json, new TypeReference<List<Map<String, String>>>() {});
    }
    
    public static List<String> parseExpectedOutputs(String json) {
        if (json == null || json.trim().isEmpty()) {
            return List.of();
        }
        return fromJson(json, new TypeReference<List<String>>() {});
    }
    
    public static List<Map<String, Object>> parseSampleTestCases(String json) {
        if (json == null || json.trim().isEmpty()) {
            return List.of();
        }
        return fromJson(json, new TypeReference<List<Map<String, Object>>>() {});
    }
}