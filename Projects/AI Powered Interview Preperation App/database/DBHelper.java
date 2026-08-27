package ai_based_interview_Prep.database;

import java.sql.*;

public class DBHelper {

    private static DBHelper instance;
    private Connection conn;

    private int loggedInUserId = -1;       
    private int loggedInUserDomainId = -1; 

    private final String URL = "jdbc:mysql://localhost:3306/ai_based_interview_prep_db";
    private final String USER = "root";        
    private final String PASS = "#As136233!MYSQL";    

    private DBHelper() {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            conn = DriverManager.getConnection(URL, USER, PASS);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("DB Connection Failed!");
        }
    }

    public static DBHelper getInstance() {
        if (instance == null) instance = new DBHelper();
        return instance;
    }

 // Static method to get a fresh connection (used in static methods)
    public static Connection getConnection() throws SQLException {
        String URL = "jdbc:mysql://localhost:3306/ai_based_interview_prep_db";
        String USER = "root";
        String PASS = "#As136233!MYSQL"; // your MySQL password
        return DriverManager.getConnection(URL, USER, PASS);
    }

    
    // ------------------- USERS -------------------

    public int addUser(String username, String password) throws SQLException {
        String query = "INSERT INTO users (username, password) VALUES (?, ?)";
        try (PreparedStatement pst = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {
            pst.setString(1, username);
            pst.setString(2, password);
            pst.executeUpdate();
            try (ResultSet rs = pst.getGeneratedKeys()) {
                if (rs.next()) return rs.getInt(1);
            }
        }
        return -1;
    }

    public int getUserId(String username, String password) throws SQLException {
        String query = "SELECT user_id FROM users WHERE username=? AND password=?";
        try (PreparedStatement pst = conn.prepareStatement(query)) {
            pst.setString(1, username);
            pst.setString(2, password);
            try (ResultSet rs = pst.executeQuery()) {
                if (rs.next()) return rs.getInt("user_id");
            }
        }
        return -1;
    }

    // ------------------- DOMAINS -------------------

    public int getDomainId(String domainName) throws SQLException {
        String query = "SELECT domain_id FROM domains WHERE domain_name=?";
        try (PreparedStatement pst = conn.prepareStatement(query)) {
            pst.setString(1, domainName);
            try (ResultSet rs = pst.executeQuery()) {
                if (rs.next()) return rs.getInt("domain_id");
            }
        }
        return -1;
    }

    public int addUserDomain(int userId, int domainId, String subDomain) throws SQLException {
        // Check if already exists
        int existingId = getUserDomainId(userId, domainId, subDomain);
        if (existingId != -1) {
            this.loggedInUserDomainId = existingId;
            return existingId;
        }

        String query = "INSERT INTO user_domains (user_id, domain_id, sub_domain) VALUES (?, ?, ?)";
        try (PreparedStatement pst = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {
            pst.setInt(1, userId);
            pst.setInt(2, domainId);
            pst.setString(3, subDomain);
            pst.executeUpdate();
            try (ResultSet rs = pst.getGeneratedKeys()) {
                if (rs.next()) {
                    this.loggedInUserDomainId = rs.getInt(1);
                    return rs.getInt(1);
                }
            }
        }
        return -1;
    }

    // ------------------- USER ANSWERS -------------------

    public void addTextAnswer(int userDomainId, int questionNo, String answerText) throws SQLException {
        String query = "INSERT INTO user_answers (user_domain_id, question_no, answer_text) VALUES (?, ?, ?)";
        try (PreparedStatement pst = conn.prepareStatement(query)) {
            pst.setInt(1, userDomainId);
            pst.setInt(2, questionNo);
            pst.setString(3, answerText);
            pst.executeUpdate();
        }
    }

    public void addAudioAnswer(int userDomainId, int questionNo, byte[] audioBytes) throws SQLException {
        String query = "INSERT INTO user_answers (user_domain_id, question_no, answer_audio) VALUES (?, ?, ?)";
        try (PreparedStatement pst = conn.prepareStatement(query)) {
            pst.setInt(1, userDomainId);
            pst.setInt(2, questionNo);
            pst.setBytes(3, audioBytes);
            pst.executeUpdate();
        }
    }

    public ResultSet getUserAnswers(int userDomainId) throws SQLException {
        String query = "SELECT * FROM user_answers WHERE user_domain_id=?";
        PreparedStatement pst = conn.prepareStatement(query);
        pst.setInt(1, userDomainId);
        return pst.executeQuery();
    }

    // ------------------- LOGGED-IN USER TRACKING -------------------

    public void setLoggedInUser(int userId) { this.loggedInUserId = userId; }
    public int getLoggedInUser() { return this.loggedInUserId; }

    public void setLoggedInUserDomain(int userDomainId) { this.loggedInUserDomainId = userDomainId; }
    public int getLoggedInUserDomain() { return this.loggedInUserDomainId; }

    // ------------------- USER DOMAIN HELPERS -------------------

    public int getUserDomainId(int userId, int domainId, String subDomain) throws SQLException {
        String query = "SELECT user_domain_id FROM user_domains WHERE user_id=? AND domain_id=? AND sub_domain=?";
        try (PreparedStatement pst = conn.prepareStatement(query)) {
            pst.setInt(1, userId);
            pst.setInt(2, domainId);
            pst.setString(3, subDomain);
            try (ResultSet rs = pst.executeQuery()) {
                if (rs.next()) return rs.getInt("user_domain_id");
            }
        }
        return -1;
    }
    
 // ------------------- VIDEO ANSWERS -------------------

    public void addVideoAnswer(int userDomainId, int questionNo, byte[] videoBytes) throws SQLException {
        String query = "INSERT INTO user_answers (user_domain_id, question_no, answer_video) VALUES (?, ?, ?)";
        try (PreparedStatement pst = conn.prepareStatement(query)) {
            pst.setInt(1, userDomainId);
            pst.setInt(2, questionNo);
            pst.setBytes(3, videoBytes);
            pst.executeUpdate();
        }
    }


    public ResultSet getVideoAnswers(int userDomainId) throws SQLException {
        String query = "SELECT question_no, answer_video FROM user_answers WHERE user_domain_id=? AND answer_video IS NOT NULL";
        PreparedStatement pst = conn.prepareStatement(query);
        pst.setInt(1, userDomainId);
        return pst.executeQuery();
    }

 // Local text similarity evaluator (no API, unlimited, offline)
    public static int localEvaluate(String userAnswer, String ref) {
        if (userAnswer == null || ref == null || userAnswer.isEmpty() || ref.isEmpty()) return 0;
        userAnswer = userAnswer.toLowerCase();
        ref = ref.toLowerCase();

        String[] userWords = userAnswer.split("\\W+");
        String[] refWords = ref.split("\\W+");

        int matches = 0;
        for (String uw : userWords) {
            for (String rw : refWords) {
                if (uw.equals(rw)) {
                    matches++;
                    break;
                }
            }
        }

        // simple proportional score (percentage)
        return (int) ((matches / (double) refWords.length) * 100);
    }

    // Fetch all answers for a user/domain
    public static ResultSet getAllAnswers(int userDomainId) {
        try {
            Connection conn = getConnection();
            String sql = "SELECT question_no, answer_text FROM user_answers WHERE user_domain_id=?";
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setInt(1, userDomainId);
            return ps.executeQuery();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // Update score for a particular question
    public static void updateScore(int userDomainId, int questionNo, int score) {
        try (Connection conn = getConnection()) {
            String sql = "UPDATE user_answers SET score=? WHERE user_domain_id=? AND question_no=?";
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setInt(1, score);
            ps.setInt(2, userDomainId);
            ps.setInt(3, questionNo);
            ps.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    
    
    // ------------------- CONNECTION -------------------

    public void closeConnection() {
        try {
            if (conn != null && !conn.isClosed()) conn.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
