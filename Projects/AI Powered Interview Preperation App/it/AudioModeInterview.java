package ai_based_interview_Prep.it;

import ai_based_interview_Prep.database.DBHelper;
import javax.sound.sampled.*;
import javax.swing.*;
import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.sql.SQLException;

public class AudioModeInterview extends JFrame {

    private JButton playQuestionButton, startRecordingButton, stopRecordingButton, nextQuestionButton, backButton;
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

    private TargetDataLine targetLine;
    private ByteArrayOutputStream audioOut;
    private int userId, domainId;
    private String subDomain = "Aptitude"; // default

    public AudioModeInterview(int userId, int domainId) {
        super("Audio Mode Interview");
        this.userId = userId;
        this.domainId = domainId;

        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(700, 250);
        setLocationRelativeTo(null);
        setLayout(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(10,10,10,10);

        playQuestionButton = new JButton("Play Question");
        startRecordingButton = new JButton("Start Recording");
        stopRecordingButton = new JButton("Stop Recording");
        nextQuestionButton = new JButton("Next Question");
        backButton = new JButton("Back");

        stopRecordingButton.setEnabled(false);
        nextQuestionButton.setEnabled(false);

        gbc.gridx=0; gbc.gridy=0; add(playQuestionButton, gbc);
        gbc.gridx=1; add(startRecordingButton, gbc);
        gbc.gridx=2; add(stopRecordingButton, gbc);
        gbc.gridx=3; add(nextQuestionButton, gbc);
        gbc.gridx=4; add(backButton, gbc);

        playQuestionButton.addActionListener(e -> playQuestion());
        startRecordingButton.addActionListener(e -> startRecording());
        stopRecordingButton.addActionListener(e -> stopRecording());
        nextQuestionButton.addActionListener(e -> nextQuestion());
        backButton.addActionListener(e -> {
            dispose();
            new IT_Aptitute_Int_Mode();
        });

        setVisible(true);
    }

    private void playQuestion() {
        if(currentQuestion >= questions.length) return;
        String text = questions[currentQuestion];
        try {
            String os = System.getProperty("os.name").toLowerCase();
            ProcessBuilder pb;
            if(os.contains("win")) {
                pb = new ProcessBuilder("powershell", "-Command",
                    "Add-Type -AssemblyName System.Speech;" +
                    "(New-Object System.Speech.Synthesis.SpeechSynthesizer).Speak('" + text + "');");
            } else if(os.contains("mac")) {
                pb = new ProcessBuilder("say", text);
            } else {
                pb = new ProcessBuilder("espeak", text);
            }
            pb.start();
        } catch(Exception e) {
            JOptionPane.showMessageDialog(this,"Audio not supported.");
            e.printStackTrace();
        }
    }

    private void startRecording() {
        try {
            AudioFormat format = new AudioFormat(16000,16,1,true,false);
            DataLine.Info info = new DataLine.Info(TargetDataLine.class, format);
            targetLine = (TargetDataLine) AudioSystem.getLine(info);
            targetLine.open(format);
            targetLine.start();

            audioOut = new ByteArrayOutputStream();
            new Thread(() -> {
                byte[] buffer = new byte[4096];
                int bytesRead;
                try {
                    while(targetLine.isOpen()) {
                        bytesRead = targetLine.read(buffer,0,buffer.length);
                        if(bytesRead>0) audioOut.write(buffer,0,bytesRead);
                    }
                } catch(Exception ex) { ex.printStackTrace(); }
            }).start();

            startRecordingButton.setEnabled(false);
            stopRecordingButton.setEnabled(true);
            JOptionPane.showMessageDialog(this,"Recording started...");

        } catch(LineUnavailableException ex) {
            ex.printStackTrace();
            JOptionPane.showMessageDialog(this,"Microphone unavailable.");
        }
    }

    private void stopRecording() {
        if(targetLine!=null) {
            targetLine.stop();
            targetLine.close();
            byte[] audioBytes = audioOut.toByteArray();

            try {
                int userDomainId = DBHelper.getInstance().getUserDomainId(userId, domainId, subDomain);
                if(userDomainId==-1) {
                    // create user_domain automatically
                    userDomainId = DBHelper.getInstance().addUserDomain(userId, domainId, subDomain);
                }
                DBHelper.getInstance().addAudioAnswer(userDomainId, currentQuestion+1, audioBytes);
            } catch(SQLException e) {
                e.printStackTrace();
                JOptionPane.showMessageDialog(this,"Error saving audio to DB.");
            }

            stopRecordingButton.setEnabled(false);
            nextQuestionButton.setEnabled(true);
            JOptionPane.showMessageDialog(this,"Recording stopped and saved!");
        }
    }

    private void nextQuestion() {
        currentQuestion++;
        if(currentQuestion<questions.length) {
            JOptionPane.showMessageDialog(this,"Next Question ready.");
            startRecordingButton.setEnabled(true);
            nextQuestionButton.setEnabled(false);
        } else {
            JOptionPane.showMessageDialog(this,"All questions completed!");
            dispose();
            new IT_Aptitute_Int_Mode();
        }
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new AudioModeInterview(1,101));
    }
}
