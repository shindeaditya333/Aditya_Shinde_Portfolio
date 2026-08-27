package ai_based_interview_Prep.it;

import ai_based_interview_Prep.database.DBHelper;

import javax.swing.*;
import java.awt.*;

public class IT_Aptitute_Int_Mode extends JFrame {

    public IT_Aptitute_Int_Mode() {
        super("Aptitude Interview"); // Set title
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(550, 350);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout());

        // Heading
        JLabel heading = new JLabel("Select Interview Mode - Aptitude");
        heading.setFont(new Font("Segoe UI", Font.BOLD, 22));
        heading.setHorizontalAlignment(SwingConstants.CENTER);
        heading.setBorder(BorderFactory.createEmptyBorder(20, 10, 20, 10));
        add(heading, BorderLayout.NORTH);

        // Mode options panel (3 boxes in a row)
        JPanel modePanel = new JPanel(new GridLayout(1, 3, 20, 20));
        modePanel.setBorder(BorderFactory.createEmptyBorder(20, 40, 20, 40));
        modePanel.setBackground(new Color(245, 245, 245));

        String[] modes = {"Text", "Audio", "Video"};
        for (String mode : modes) {
            JPanel box = createModeBox(mode, () -> {
                dispose(); // Close current frame

                // Fetch logged-in userId and domainId automatically
                int userId = DBHelper.getInstance().getLoggedInUser();
                int domainId = DBHelper.getInstance().getLoggedInUserDomain();
                if (userId == -1 || domainId == -1) {
                    JOptionPane.showMessageDialog(this, "User or domain not found.");
                    return;
                }

                switch (mode) {
                    case "Text":
                        new TextModeInterview(userId, domainId); // Open Text Mode with DB integration
                        break;
                    case "Audio":
                        new AudioModeInterview(userId, domainId); // Open Audio Mode with DB integration
                        break;
                    case "Video":
                        JOptionPane.showMessageDialog(this, "Video Mode not implemented yet.");
                        break;
                    default:
                        JOptionPane.showMessageDialog(this, "Mode not implemented yet.");
                }
            });
            modePanel.add(box);
        }

        add(modePanel, BorderLayout.CENTER);

        // Back button
        addBackButton(() -> {
            dispose(); // Close current frame
            new Information_Technology(); // Open IT page
        });

        setVisible(true);
    }

    private JPanel createModeBox(String name, Runnable onClick) {
        JPanel box = new JPanel();
        box.setBackground(new Color(230, 240, 255)); // light blue
        box.setBorder(BorderFactory.createLineBorder(new Color(100, 149, 237), 1));
        box.setLayout(new GridBagLayout());
        box.setCursor(new Cursor(Cursor.HAND_CURSOR));
        box.setPreferredSize(new Dimension(140, 60));

        JLabel label = new JLabel(name);
        label.setFont(new Font("Segoe UI", Font.BOLD, 14));
        box.add(label);

        // Hover effect
        box.addMouseListener(new java.awt.event.MouseAdapter() {
            @Override
            public void mouseEntered(java.awt.event.MouseEvent e) { box.setBackground(new Color(200, 220, 255)); }
            @Override
            public void mouseExited(java.awt.event.MouseEvent e) { box.setBackground(new Color(230, 240, 255)); }
            @Override
            public void mouseClicked(java.awt.event.MouseEvent e) { onClick.run(); }
        });

        return box;
    }

    private void addBackButton(Runnable onBack) {
        JButton backButton = new JButton("Back");
        backButton.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        backButton.setFocusPainted(false);
        backButton.setPreferredSize(new Dimension(80, 30));
        backButton.addActionListener(e -> onBack.run());

        JPanel bottomPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        bottomPanel.setOpaque(false);
        bottomPanel.setBorder(BorderFactory.createEmptyBorder(0, 0, 10, 10));
        bottomPanel.add(backButton);

        add(bottomPanel, BorderLayout.SOUTH);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(IT_Aptitute_Int_Mode::new);
    }
}
