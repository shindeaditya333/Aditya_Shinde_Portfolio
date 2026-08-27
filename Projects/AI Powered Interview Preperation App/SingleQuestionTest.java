package ai_based_interview_Prep;
import java.net.HttpURLConnection;
import java.net.URL;
import java.io.OutputStream;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import org.json.JSONArray;
import org.json.JSONObject;

public class SingleQuestionTest {

    private static final String API_KEY = System.getenv("OPENAI_API_KEY");

    public static void main(String[] args) {
        String question = "Q1: Explain the basics of OOP.";
        String userAnswer = "OOP means Object-Oriented Programming which focuses on creating objects that contain both data and methods.";

        try {
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
                  + "Respond only in JSON format: {\"scores\": [0-100]} — no explanations.");
            messages.put(system);

            JSONObject userMsg = new JSONObject();
            userMsg.put("role", "user");
            userMsg.put("content",
                    "Evaluate this answer and give a score from 0 to 100.\n\nQuestion: " + question + "\nAnswer: " + userAnswer);
            messages.put(userMsg);

            payload.put("messages", messages);
            payload.put("max_tokens", 100);

            try (OutputStream os = conn.getOutputStream()) {
                os.write(payload.toString().getBytes());
            }

            int responseCode = conn.getResponseCode();
            System.out.println("HTTP Response Code: " + responseCode);

            if (responseCode == 401) {
                System.out.println("❌ Unauthorized – check your API key.");
                return;
            }

            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) response.append(line);

            JSONObject jsonResponse = new JSONObject(response.toString());
            String content = jsonResponse
                    .getJSONArray("choices")
                    .getJSONObject(0)
                    .getJSONObject("message")
                    .getString("content")
                    .trim();

            System.out.println("API Response: " + content);

        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
        }
    }
}
