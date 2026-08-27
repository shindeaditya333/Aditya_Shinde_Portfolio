package ai_based_interview_Prep.it;

import ai_based_interview_Prep.database.DBHelper;

import javax.swing.*;
import java.awt.*;
import java.io.File;

public class VideoModeInterview extends JFrame {

    private JButton uploadVideoButton, nextQuestionButton, backButton;
    private JLabel questionLabel;
    private int currentQuestion = 0;

    private String[] questions = {
        "Explain the basics of Object Oriented Programming.",
        "What is Inheritance?",
        "Difference between Abstract Class and Interface?",
        "What is Polymorphism?",
        "What is Encapsulation?",
        "Explain SQL versus NoSQL.",
        "What is REST API?",
        "Explain HTTP methods.",
        "What is Exception Handling?",
        "How do you handle multithreading in Java?"
    };

    private int userId, domainId;
    private String subDomain = "Aptitude"; // default sub-domain

    public VideoModeInterview(int userId, int domainId) {
        super("Video Mode Interview");
        this.userId = userId;
        this.domainId = domainId;

        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(800, 300);
        setLocationRelativeTo(null);
        setLayout(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(10, 10, 10, 10);

        // Question label
        questionLabel = new JLabel(questions[currentQuestion]);
        questionLabel.setFont(new Font("Segoe UI", Font.PLAIN, 16));
        gbc.gridx = 0; gbc.gridy = 0; gbc.gridwidth = 3;
        add(questionLabel, gbc);

        // Buttons
        uploadVideoButton = new JButton("Upload Video Answer");
        nextQuestionButton = new JButton("Next Question");
        backButton = new JButton("Back");

        nextQuestionButton.setEnabled(false); // initially disabled

        gbc.gridwidth = 1; // reset for buttons
        gbc.gridy = 1;
        gbc.gridx = 0; add(uploadVideoButton, gbc);
        gbc.gridx = 1; add(nextQuestionButton, gbc);
        gbc.gridx = 2; add(backButton, gbc);

        // Button actions
        uploadVideoButton.addActionListener(e -> uploadVideo());
        nextQuestionButton.addActionListener(e -> nextQuestion());
        backButton.addActionListener(e -> {
            dispose();
            new IT_Aptitute_Int_Mode(); // return to previous mode menu
        });

        setVisible(true);
    }

    // Upload video for current question
    private void uploadVideo() {
        if(currentQuestion >= questions.length) return;

        JFileChooser fileChooser = new JFileChooser();
        int result = fileChooser.showOpenDialog(this);

        if(result == JFileChooser.APPROVE_OPTION) {
            File file = fileChooser.getSelectedFile();
            try {
                byte[] videoBytes = java.nio.file.Files.readAllBytes(file.toPath());

                int userDomainId = DBHelper.getInstance().getUserDomainId(userId, domainId, subDomain);
                if(userDomainId == -1) {
                    // create user_domain automatically if it doesn't exist
                    userDomainId = DBHelper.getInstance().addUserDomain(userId, domainId, subDomain);
                }

                // Save video answer to DB
                DBHelper.getInstance().addVideoAnswer(userDomainId, currentQuestion + 1, videoBytes);
                JOptionPane.showMessageDialog(this,"Video uploaded successfully!");

                uploadVideoButton.setEnabled(false);
                nextQuestionButton.setEnabled(true);

            } catch (Exception ex) {
                ex.printStackTrace();
                JOptionPane.showMessageDialog(this,"Error uploading video.");
            }
        }
    }

    // Move to next question
    private void nextQuestion() {
        currentQuestion++;
        if(currentQuestion < questions.length) {
            questionLabel.setText(questions[currentQuestion]);
            uploadVideoButton.setEnabled(true);
            nextQuestionButton.setEnabled(false);
        } else {
            JOptionPane.showMessageDialog(this,"All questions completed!");
            dispose();
            new IT_Aptitute_Int_Mode(); // return to mode menu
        }
    }

    // Main method for testing
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new VideoModeInterview(1, 101));
    }
}
