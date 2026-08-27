package ai_based_interview_Prep;

import ai_based_interview_Prep.database.DBHelper;

import javax.swing.*;
import java.awt.*;
import java.sql.SQLException;

public class Login extends JFrame {

    public Login() {
        setTitle("AI-Powered Interview Simulator - Login");
        setSize(500, 400);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new BorderLayout());

        // Background panel
        JPanel background = new JPanel();
        background.setBackground(new Color(58, 123, 213));
        background.setLayout(new GridBagLayout());

        // Login panel
        JPanel panel = new JPanel();
        panel.setBackground(Color.WHITE);
        panel.setPreferredSize(new Dimension(380, 300));
        panel.setLayout(new GridBagLayout());
        panel.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(15, 10, 15, 10);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        JLabel headingLabel = new JLabel("AI-Based Interview Preparation");
        headingLabel.setFont(new Font("Segoe UI", Font.BOLD, 22));
        headingLabel.setHorizontalAlignment(SwingConstants.CENTER);
        gbc.gridx = 0; gbc.gridy = 0; gbc.gridwidth = 2;
        panel.add(headingLabel, gbc);

        JLabel userLabel = new JLabel("Username:");
        userLabel.setFont(new Font("Segoe UI", Font.PLAIN, 16));
        gbc.gridy = 1; gbc.gridwidth = 1; gbc.gridx = 0;
        panel.add(userLabel, gbc);

        JTextField userField = new JTextField();
        userField.setFont(new Font("Segoe UI", Font.PLAIN, 16));
        userField.setPreferredSize(new Dimension(250, 40));
        gbc.gridx = 1;
        panel.add(userField, gbc);

        JLabel passLabel = new JLabel("Password:");
        passLabel.setFont(new Font("Segoe UI", Font.PLAIN, 16));
        gbc.gridx = 0; gbc.gridy = 2;
        panel.add(passLabel, gbc);

        JPasswordField passField = new JPasswordField();
        passField.setFont(new Font("Segoe UI", Font.PLAIN, 16));
        passField.setPreferredSize(new Dimension(250, 40));
        gbc.gridx = 1;
        panel.add(passField, gbc);

        JButton loginButton = new JButton("Login");
        loginButton.setFont(new Font("Segoe UI", Font.BOLD, 18));
        loginButton.setBackground(new Color(58, 123, 213));
        loginButton.setForeground(Color.WHITE);
        loginButton.setFocusPainted(false);
        loginButton.setPreferredSize(new Dimension(250, 45));
        gbc.gridx = 0; gbc.gridy = 3; gbc.gridwidth = 2;
        panel.add(loginButton, gbc);

        background.add(panel);
        add(background, BorderLayout.CENTER);

        JButton helpButton = new JButton("?");
        helpButton.setFont(new Font("Segoe UI", Font.BOLD, 16));
        helpButton.setFocusPainted(false);
        helpButton.setContentAreaFilled(false);
        helpButton.setBorderPainted(false);
        helpButton.setForeground(Color.WHITE);
        helpButton.setCursor(new Cursor(Cursor.HAND_CURSOR));
        JPanel helpPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        helpPanel.setOpaque(false);
        helpPanel.add(helpButton);
        add(helpPanel, BorderLayout.SOUTH);

        // ------------------- LOGIN ACTION -------------------
        loginButton.addActionListener(e -> {
            String username = userField.getText().trim();
            String password = new String(passField.getPassword()).trim();

            // ------------------- VALIDATION -------------------
            if (username.isEmpty() || password.isEmpty()) {
                JOptionPane.showMessageDialog(this, "Username and Password cannot be empty!", "Error", JOptionPane.ERROR_MESSAGE);
                return;
            }
            if (username.length() < 3 || username.length() > 50) {
                JOptionPane.showMessageDialog(this, "Username must be 3-50 characters.", "Error", JOptionPane.ERROR_MESSAGE);
                return;
            }
            if (password.length() < 4 || password.length() > 20) {
                JOptionPane.showMessageDialog(this, "Password must be 4-20 characters.", "Error", JOptionPane.ERROR_MESSAGE);
                return;
            }

            try {
                DBHelper db = DBHelper.getInstance();
                int userId = db.getUserId(username, password);

                if (userId == -1) {
                    // User not found, create new
                    userId = db.addUser(username, password);
                    if (userId != -1) {
                        // store logged-in user ID globally
                        DBHelper.getInstance().setLoggedInUser(userId);

                        JOptionPane.showMessageDialog(this, "User registered successfully! Welcome " + username + "!");
                        new Domain_Selection();
                        dispose();
                    } else {
                        JOptionPane.showMessageDialog(this, "Error creating user!", "Error", JOptionPane.ERROR_MESSAGE);
                    }
                } else {
                    // User exists and password correct
                    // store logged-in user ID globally
                    DBHelper.getInstance().setLoggedInUser(userId);

                    JOptionPane.showMessageDialog(this, "Login successful! Welcome " + username + "!");
                    new Domain_Selection();
                    dispose();
                }

            } catch (SQLException ex) {
                ex.printStackTrace();
                JOptionPane.showMessageDialog(this, "Database error: " + ex.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
            }
        });

        helpButton.addActionListener(e -> JOptionPane.showMessageDialog(this,
                "Enter your username and password.\nNew users will be registered automatically."));

        setVisible(true);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(Login::new);
    }
}
