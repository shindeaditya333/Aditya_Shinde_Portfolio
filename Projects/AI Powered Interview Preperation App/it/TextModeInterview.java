package ai_based_interview_Prep.it;

import ai_based_interview_Prep.database.DBHelper;
import ai_based_interview_Prep.database.GeminiHelper_text;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.sql.SQLException;

public class TextModeInterview extends JFrame {

    private JLabel questionLabel;
    private JTextArea answerArea;
    private JButton submitButton;

    private String[] questions = {
            "Q1: Explain the basics of OOP.",
            "Q2: What is Inheritance?",
            "Q3: Difference between Abstract Class and Interface?",
            "Q4: What is Polymorphism?",
            "Q5: What is Encapsulation?",
            "Q6: Explain SQL vs NoSQL.",
            "Q7: What is REST API?",
            "Q8: Explain HTTP methods.",
            "Q9: What is Exception Handling?",
            "Q10: How do you handle multithreading in Java?"
    };

    private String[] answers = new String[questions.length];
    private int currentQuestion = 0;

    private int userId;
    private int domainId;
    private int userDomainId;

    public TextModeInterview(int userId, int domainId) {
        super("Text Mode Interview");
        this.userId = userId;
        this.domainId = domainId;

        try {
            userDomainId = DBHelper.getInstance().addUserDomain(userId, domainId, "Aptitude");
        } catch (SQLException e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, "Error initializing user domain.");
            dispose();
            return;
        }

        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(600, 400);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout(10, 10));

        questionLabel = new JLabel(questions[currentQuestion]);
        questionLabel.setFont(new Font("Segoe UI", Font.BOLD, 16));
        questionLabel.setBorder(BorderFactory.createEmptyBorder(20, 20, 10, 20));
        add(questionLabel, BorderLayout.NORTH);

        answerArea = new JTextArea(5, 40);
        answerArea.setLineWrap(true);
        answerArea.setWrapStyleWord(true);
        answerArea.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        JScrollPane scrollPane = new JScrollPane(answerArea,
                JScrollPane.VERTICAL_SCROLLBAR_AS_NEEDED,
                JScrollPane.HORIZONTAL_SCROLLBAR_NEVER);
        scrollPane.setBorder(BorderFactory.createLineBorder(Color.GRAY, 1));
        add(scrollPane, BorderLayout.CENTER);

        submitButton = new JButton("Next");
        submitButton.setFont(new Font("Segoe UI", Font.BOLD, 14));
        submitButton.setFocusPainted(false);
        submitButton.addActionListener(this::handleNext);

        JButton backButton = new JButton("Back");
        backButton.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        backButton.setFocusPainted(false);
        backButton.addActionListener(e -> {
            dispose();
            new IT_Aptitute_Int_Mode();
        });

        JPanel bottomPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        bottomPanel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 20));
        bottomPanel.add(backButton);
        bottomPanel.add(submitButton);
        add(bottomPanel, BorderLayout.SOUTH);

        setVisible(true);
    }

    private void handleNext(ActionEvent e) {
        String answer = answerArea.getText().trim();
        if (answer.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Please type your answer before proceeding.");
            return;
        }

        answers[currentQuestion] = answer;

        try {
            DBHelper.getInstance().addTextAnswer(userDomainId, currentQuestion + 1, answer);
        } catch (SQLException ex) {
            ex.printStackTrace();
            JOptionPane.showMessageDialog(this, "Error saving answer to DB.");
        }

        currentQuestion++;
        if (currentQuestion < questions.length) {
            questionLabel.setText(questions[currentQuestion]);
            answerArea.setText("");
            if (currentQuestion == questions.length - 1) submitButton.setText("End Test");
        } else {
            showAllAnswers();
        }
    }

    private void showAllAnswers() {
        getContentPane().removeAll();

        JLabel heading = new JLabel("Your Answers");
        heading.setFont(new Font("Segoe UI", Font.BOLD, 18));
        heading.setHorizontalAlignment(SwingConstants.CENTER);
        heading.setBorder(BorderFactory.createEmptyBorder(20, 10, 20, 10));
        add(heading, BorderLayout.NORTH);

        JTextArea allAnswersArea = new JTextArea();
        allAnswersArea.setEditable(false);
        allAnswersArea.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        allAnswersArea.setLineWrap(true);
        allAnswersArea.setWrapStyleWord(true);
        JScrollPane scrollPane = new JScrollPane(allAnswersArea,
                JScrollPane.VERTICAL_SCROLLBAR_AS_NEEDED,
                JScrollPane.HORIZONTAL_SCROLLBAR_NEVER);
        scrollPane.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));
        add(scrollPane, BorderLayout.CENTER);

        JButton evaluateButton = new JButton("Evaluate");
        evaluateButton.setFont(new Font("Segoe UI", Font.BOLD, 14));
        evaluateButton.setFocusPainted(false);
        evaluateButton.addActionListener(e -> {
            try {
                StringBuilder sbScores = new StringBuilder();
                int totalScore = 0;

                int[] scores = GeminiHelper_text.evaluateAllAnswersWithRetries(questions, answers);

                for (int i = 0; i < questions.length; i++) {
                    int score = scores[i];

                    // Detect if offline fallback was used for this score
                    boolean offlineUsed = score < 10; // optional heuristic
                    if (offlineUsed) {
                        sbScores.append("[Offline Fallback] ");
                    }

                    DBHelper.updateScore(userDomainId, i + 1, score);
                    totalScore += score;

                    sbScores.append(questions[i]).append("\n");
                    sbScores.append("Answer: ").append(answers[i]).append("\n");
                    sbScores.append("Score: ").append(score).append("/100\n\n");
                }


                int avgScore = totalScore / questions.length;
                sbScores.append("Average Score: ").append(avgScore).append("/100");

                allAnswersArea.setText(sbScores.toString());
            } catch (Exception ex) {
                ex.printStackTrace();
                JOptionPane.showMessageDialog(this, "Error evaluating answers.");
            }
        });

        JButton backButton = new JButton("Back");
        backButton.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        backButton.setFocusPainted(false);
        backButton.addActionListener(e -> {
            dispose();
            new IT_Aptitute_Int_Mode();
        });

        JPanel bottomPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        bottomPanel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 20));
        bottomPanel.add(backButton);
        bottomPanel.add(evaluateButton);
        add(bottomPanel, BorderLayout.SOUTH);

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < questions.length; i++) {
            sb.append(questions[i]).append("\n");
            sb.append("Answer: ").append(answers[i]).append("\n\n");
        }
        allAnswersArea.setText(sb.toString());

        revalidate();
        repaint();
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new TextModeInterview(1, 101));
    }
}
