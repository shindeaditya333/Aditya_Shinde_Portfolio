package ai_based_interview_Prep.database;

import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.io.OutputStream;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import org.json.JSONArray;
import org.json.JSONObject;

public class OpenAIHelper_text {

    private static final String API_KEY = System.getenv("OPENAI_API_KEY");

    // ----- Public method: evaluate all answers safely -----
    public static int[] evaluateAllAnswersWithRetries(String[] questions, String[] userAnswers) {
        int[] scores = new int[questions.length];

        for (int i = 0; i < questions.length; i++) {
            boolean success = false;
            int retries = 0;

            while (!success && retries < 1) { // max 2 retries
                try {
                    int[] singleScore = evaluateAllAnswers(new String[]{questions[i]}, new String[]{userAnswers[i]});
                    scores[i] = singleScore[0];
                    success = true;
                } catch (Exception e) {
                    retries++;
                    System.err.println("⚠️ API failed for Q" + (i + 1) + ", retry " + retries + ". Error: " + e.getMessage());
                    try { Thread.sleep(2500); } catch (InterruptedException ie) {}
                }
            }

            if (!success) {
                System.err.println("⚠️ Using offline fallback for Q" + (i + 1));
                scores[i] = localEvaluate(userAnswers[i], questions[i]);
            }

            try { Thread.sleep(1500); } catch (InterruptedException ie) {} // small delay between requests
        }

        return scores;
    }

    // ----- Method that calls the API -----
    private static int[] evaluateAllAnswers(String[] questions, String[] userAnswers) throws Exception {
        URL url = new URL("https://api.openai.com/v1/chat/completions");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Authorization", "Bearer " + API_KEY);
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setDoOutput(true);

        JSONObject payload = new JSONObject();
        payload.put("model", "gpt-3.5-turbo");

        JSONArray messages = new JSONArray();

        JSONObject system = new JSONObject();
        system.put("role", "system");
        system.put("content",
                "You are a strict evaluator. Score each user answer (0–100) based on correctness, completeness, and similarity to the question's topic. "
              + "Respond only in JSON format: {\"scores\": [80, 65, 90, ...]} — no explanations.");
        messages.put(system);

        StringBuilder prompt = new StringBuilder();
        prompt.append("Evaluate the following answers and give a score from 0 to 100 for each.\n");
        prompt.append("Return only JSON in the form {\"scores\": [..]}.\n\n");

        for (int i = 0; i < questions.length; i++) {
            prompt.append("Q").append(i + 1).append(": ").append(questions[i]).append("\n");
            prompt.append("User Answer: ").append(userAnswers[i]).append("\n\n");
        }

        JSONObject userMsg = new JSONObject();
        userMsg.put("role", "user");
        userMsg.put("content", prompt.toString());
        messages.put(userMsg);

        payload.put("messages", messages);
        payload.put("max_tokens", 300);

        try (OutputStream os = conn.getOutputStream()) {
            os.write(payload.toString().getBytes());
        }

        int responseCode = conn.getResponseCode();
        System.out.println("API Response Code: " + responseCode);

        BufferedReader br = new BufferedReader(
                new InputStreamReader(conn.getErrorStream() != null ? conn.getErrorStream() : conn.getInputStream())
        );

        StringBuilder response = new StringBuilder();
        String line;
        while ((line = br.readLine()) != null) response.append(line);
        System.out.println("API Response Body: " + response.toString());

        if (responseCode != 200) {
            throw new Exception("API call failed with response code: " + responseCode);
        }

        JSONObject jsonResponse = new JSONObject(response.toString());
        String content = jsonResponse
                .getJSONArray("choices")
                .getJSONObject(0)
                .getJSONObject("message")
                .getString("content")
                .trim();

        try {
            JSONObject resultJson = new JSONObject(content);
            JSONArray scoresArray = resultJson.getJSONArray("scores");
            int[] scores = new int[scoresArray.length()];
            for (int i = 0; i < scoresArray.length(); i++) {
                scores[i] = scoresArray.getInt(i);
            }
            return scores;
        } catch (Exception parseError) {
            throw new Exception("API returned unexpected format: " + content);
        }
    }

    // ----- Offline fallback -----
    public static int[] localEvaluateAll(String[] questions, String[] userAnswers) {
        int[] scores = new int[questions.length];
        for (int i = 0; i < questions.length; i++) {
            scores[i] = localEvaluate(userAnswers[i], questions[i]);
        }
        return scores;
    }

    private static final Set<String> STOPWORDS = new HashSet<>(Arrays.asList(
            "a", "an", "the", "is", "in", "on", "at", "of", "and", "or", "to", "for", "by", "with"
    ));

    private static int localEvaluate(String userAnswer, String referenceAnswer) {
        if (userAnswer == null || referenceAnswer == null || userAnswer.isEmpty() || referenceAnswer.isEmpty()) return 0;

        userAnswer = userAnswer.toLowerCase().replaceAll("[^a-z0-9 ]", " ");
        referenceAnswer = referenceAnswer.toLowerCase().replaceAll("[^a-z0-9 ]", " ");

        Set<String> refWords = new HashSet<>();
        for (String w : referenceAnswer.split("\\s+")) {
            w = simpleStem(w);
            if (!STOPWORDS.contains(w)) refWords.add(w);
        }

        Set<String> userWords = new HashSet<>();
        for (String w : userAnswer.split("\\s+")) {
            w = simpleStem(w);
            if (!STOPWORDS.contains(w)) userWords.add(w);
        }

        int matches = 0;
        for (String uw : userWords) {
            if (refWords.contains(uw)) matches++;
        }

        double score = ((double) matches / Math.max(refWords.size(), 1)) * 100;
        if (score > 0 && userWords.size() < 3) score = Math.min(score + 5, 100);
        return (int) Math.min(score, 100);
    }

    private static String simpleStem(String word) {
        if (word.endsWith("ing") && word.length() > 4) return word.substring(0, word.length() - 3);
        if (word.endsWith("ed") && word.length() > 3) return word.substring(0, word.length() - 2);
        if (word.endsWith("s") && word.length() > 3) return word.substring(0, word.length() - 1);
        return word;
    }
}
