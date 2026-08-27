package ai_based_interview_Prep.database;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;
import org.json.JSONArray;
import org.json.JSONObject;

public class GeminiHelper_text {

    private static final String API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
    private static final String API_KEY = System.getenv("GEMINI_API_KEY");
    private static final int MAX_RETRIES = 1;

    public static int[] evaluateAllAnswersWithRetries(String[] questions, String[] answers) {
        int[] scores = new int[questions.length];
        int attempt = 0;
        boolean success = false;

        while (attempt < MAX_RETRIES && !success) {
            try {
                System.out.println("🔹 Attempt " + (attempt + 1) + " to call Gemini API...");
                scores = callGeminiAPI(questions, answers);
                success = true;
                System.out.println("✅ Gemini API call successful!");
            } catch (Exception e) {
                System.err.println("❌ Attempt " + (attempt + 1) + " failed:");
                e.printStackTrace(); // full trace printed
                attempt++;
                try { Thread.sleep(2000); } catch (InterruptedException ignored) {}
            }
        }

        // If all attempts fail
        if (!success) {
            System.err.println("\n⚠️ All Gemini API attempts failed. Switching to offline evaluation...\n");
            scores = offlineEvaluate(questions, answers);
        }

        // Print all results (for clarity)
        int total = 0;
        for (int i = 0; i < questions.length; i++) {
            System.out.println("[Result] Q" + (i + 1) + ": " + questions[i]);
            System.out.println("Answer: " + answers[i]);
            System.out.println("Score: " + scores[i] + "/100\n");
            total += scores[i];
        }
        System.out.println("Average Score: " + (total / questions.length) + "/100");

        return scores;
    }

    private static int[] offlineEvaluate(String[] questions, String[] answers) {
        int n = questions.length;
        int[] scores = new int[n];

        Map<Integer, String[]> keywordsPerQuestion = new HashMap<>();
        keywordsPerQuestion.put(0, new String[]{"object", "class", "encapsulation", "inheritance", "polymorphism"});
        keywordsPerQuestion.put(1, new String[]{"inheritance", "extends", "parent", "child"});
        keywordsPerQuestion.put(2, new String[]{"abstract", "interface", "method", "implementation"});
        keywordsPerQuestion.put(3, new String[]{"polymorphism", "overloading", "overriding"});
        keywordsPerQuestion.put(4, new String[]{"encapsulation", "private", "getter", "setter"});
        keywordsPerQuestion.put(5, new String[]{"sql", "nosql", "database", "relational", "non-relational"});
        keywordsPerQuestion.put(6, new String[]{"rest", "api", "http", "get", "post", "put", "delete"});
        keywordsPerQuestion.put(7, new String[]{"get", "post", "put", "delete", "patch", "head", "options"});
        keywordsPerQuestion.put(8, new String[]{"exception", "try", "catch", "finally", "throw"});
        keywordsPerQuestion.put(9, new String[]{"thread", "multithreading", "synchronized", "concurrency"});

        for (int i = 0; i < n; i++) {
            String answer = answers[i].toLowerCase();
            String[] keywords = keywordsPerQuestion.getOrDefault(i, new String[]{});
            int score = 0;
            for (String keyword : keywords) {
                if (answer.contains(keyword.toLowerCase())) {
                    score += 10;
                }
            }
            if (score > 100) score = 100;
            if (score == 0) score = 10;
            scores[i] = score;
        }

        return scores;
    }

    private static int[] callGeminiAPI(String[] questions, String[] answers) throws Exception {
        int n = questions.length;
        int[] scores = new int[n];

        StringBuilder promptText = new StringBuilder();
        promptText.append("Evaluate the following answers from 0 to 100. Respond only in JSON format: {\"scores\": [score1, score2, ...]}\n\n");
        for (int i = 0; i < n; i++) {
            promptText.append("Q").append(i + 1).append(": ").append(questions[i]).append("\n");
            promptText.append("Answer: ").append(answers[i]).append("\n\n");
        }

        JSONObject requestBody = new JSONObject();
        JSONArray contentsArray = new JSONArray();
        JSONObject partsObj = new JSONObject();
        partsObj.put("text", promptText.toString());
        JSONArray partsArray = new JSONArray();
        partsArray.put(partsObj);
        JSONObject contentObj = new JSONObject();
        contentObj.put("parts", partsArray);
        contentsArray.put(contentObj);
        requestBody.put("contents", contentsArray);

        System.out.println("📤 Sending request to Gemini API...");
        System.out.println(requestBody.toString(2));

        URL url = new URL(API_URL + "?key=" + API_KEY);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
        conn.setDoOutput(true);

        try (OutputStream os = conn.getOutputStream()) {
            os.write(requestBody.toString().getBytes("UTF-8"));
        }

        int responseCode = conn.getResponseCode();
        System.out.println("🌐 Response Code: " + responseCode);

        BufferedReader reader;
        if (responseCode == 200) {
            reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        } else {
            reader = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
            StringBuilder errSb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                errSb.append(line);
            }
            System.err.println("❗API Error: " + errSb.toString());
            throw new Exception("Gemini API failed with code " + responseCode);
        }

        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }
        System.out.println("📥 Raw API Response: " + sb.toString());

        JSONObject responseJson = new JSONObject(sb.toString());
        JSONArray candidates = responseJson.getJSONArray("candidates");
        JSONObject content = candidates.getJSONObject(0).getJSONObject("content");

        String rawText = "";
        if (content.has("parts")) {
            rawText = content.getJSONArray("parts").getJSONObject(0).getString("text");
        } else if (content.has("text")) {
            rawText = content.getString("text");
        }
        rawText = rawText.replaceAll("```json", "").replaceAll("```", "").trim();

        System.out.println("🧠 Parsed Text: " + rawText);

        JSONObject scoresJson = new JSONObject(rawText);
        JSONArray scoresArray = scoresJson.getJSONArray("scores");
        for (int i = 0; i < n; i++) {
            scores[i] = scoresArray.getInt(i);
        }

        return scores;
    }
}
