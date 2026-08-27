package ai_based_interview_Prep.it;

import ai_based_interview_Prep.database.DBHelper;
import ai_based_interview_Prep.Domain_Selection;

import javax.swing.*;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.sql.SQLException;

public class Information_Technology extends JFrame {

    public Information_Technology() {
        super("Information Technology Interview"); // set title
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(550, 350);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout());

        // Heading
        JLabel heading = new JLabel("Information Technology Interview");
        heading.setFont(new Font("Segoe UI", Font.BOLD, 22));
        heading.setHorizontalAlignment(SwingConstants.CENTER);
        heading.setBorder(BorderFactory.createEmptyBorder(20, 10, 20, 10));
        add(heading, BorderLayout.NORTH);

        // Options panel (3 boxes in a row)
        JPanel optionsPanel = new JPanel(new GridLayout(1, 3, 20, 20));
        optionsPanel.setBorder(BorderFactory.createEmptyBorder(20, 40, 20, 40));
        optionsPanel.setBackground(new Color(245, 245, 245));

        String[] options = {"Aptitude", "Technical", "HR"};
        for (String opt : options) {
            JPanel box = createOptionBox(opt, () -> {
                dispose(); // close current frame

                // Fetch the userDomainId stored in DBHelper
                int userDomainId = DBHelper.getInstance().getLoggedInUserDomain();
                if (userDomainId == -1) {
                    JOptionPane.showMessageDialog(null, "No domain selected for this user.");
                    return;
                }

                switch (opt) {
                    case "Aptitude":
                        new IT_Aptitute_Int_Mode();   // IT aptitude page
                        break;
                    default:
                        JOptionPane.showMessageDialog(null,
                                "Page for " + opt + " not implemented yet.");
                }
            });
            optionsPanel.add(box);
        }

        add(optionsPanel, BorderLayout.CENTER);

        // Back button
        addBackButton(() -> {
            dispose(); // close current frame
            SwingUtilities.invokeLater(Domain_Selection::new);
        });

        setVisible(true);
    }

    private JPanel createOptionBox(String name, Runnable onClick) {
        JPanel box = new JPanel();
        box.setBackground(new Color(230, 240, 255)); // light blue
        box.setBorder(BorderFactory.createLineBorder(new Color(100, 149, 237), 1));
        box.setLayout(new GridBagLayout());
        box.setCursor(new Cursor(Cursor.HAND_CURSOR));
        box.setPreferredSize(new Dimension(140, 30));

        JLabel label = new JLabel(name);
        label.setFont(new Font("Segoe UI", Font.BOLD, 14));
        box.add(label);

        // Hover effect
        box.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseEntered(MouseEvent e) { box.setBackground(new Color(200, 220, 255)); }
            @Override
            public void mouseExited(MouseEvent e) { box.setBackground(new Color(230, 240, 255)); }
            @Override
            public void mouseClicked(MouseEvent e) { onClick.run(); }
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
        SwingUtilities.invokeLater(Information_Technology::new);
    }
}
