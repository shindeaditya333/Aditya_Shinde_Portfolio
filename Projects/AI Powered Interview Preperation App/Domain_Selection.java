package ai_based_interview_Prep;
import ai_based_interview_Prep.database.DBHelper;

import javax.swing.*;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import ai_based_interview_Prep.it.Information_Technology;
import java.sql.SQLException;


public class Domain_Selection extends JFrame {

    public Domain_Selection() {
        super("Select Interview Domain"); 
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(550, 400);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout());

        // Heading
        JLabel heading = new JLabel("Choose Your Interview Domain");
        heading.setFont(new Font("Segoe UI", Font.BOLD, 22));
        heading.setHorizontalAlignment(SwingConstants.CENTER);
        heading.setBorder(BorderFactory.createEmptyBorder(20, 10, 20, 10));
        add(heading, BorderLayout.NORTH);

        // Panel to hold domain boxes
        JPanel domainPanel = new JPanel();
        domainPanel.setLayout(new GridLayout(3, 3, 10, 10)); // 3x3 grid
        domainPanel.setBorder(BorderFactory.createEmptyBorder(20, 30, 20, 30));
        domainPanel.setBackground(new Color(245, 245, 245)); // light neutral

        // Domains
        String[] domains = {
                "Civil Services", "Information Technology", "Banking",
                "Engineering", "Medical", "Law", "Education", "Management", "Design"
        };
        for (String domain : domains) {
            JPanel box = createDomainBox(domain);
            domainPanel.add(box);
        }

        add(domainPanel, BorderLayout.CENTER);

        // Back Button (Bottom Right)
        JButton backButton = new JButton("Back");
        backButton.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        backButton.setFocusPainted(false);
        backButton.setPreferredSize(new Dimension(80, 30));
        backButton.addActionListener(e -> {
            dispose(); // Close this page
            new Login(); // Open login page
        });

        JPanel bottomPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        bottomPanel.setOpaque(false);
        bottomPanel.setBorder(BorderFactory.createEmptyBorder(0, 0, 10, 10));
        bottomPanel.add(backButton);
        add(bottomPanel, BorderLayout.SOUTH);

        setVisible(true);
    }

    private JPanel createDomainBox(String domainName) {
        JPanel box = new JPanel();
        box.setBackground(new Color(230, 240, 255)); // light blue
        box.setBorder(BorderFactory.createLineBorder(new Color(100, 149, 237), 1));
        box.setLayout(new GridBagLayout());
        box.setCursor(new Cursor(Cursor.HAND_CURSOR));
        box.setPreferredSize(new Dimension(140, 60));

        JLabel label = new JLabel(domainName);
        label.setFont(new Font("Segoe UI", Font.BOLD, 14));
        box.add(label);

        // Hover effect
        box.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseEntered(MouseEvent e) { box.setBackground(new Color(200, 220, 255)); }
            @Override
            public void mouseExited(MouseEvent e) { box.setBackground(new Color(230, 240, 255)); }
            @Override
            public void mouseClicked(MouseEvent e) {
                DBHelper db = DBHelper.getInstance();
                int userId = db.getLoggedInUser(); // get logged-in user ID
                int domainId = -1;
                try {
                    domainId = db.getDomainId(domainName); // get domain ID from DB
                    if (domainId == -1) {
                        JOptionPane.showMessageDialog(null, "Domain not found in DB!");
                        return;
                    }
                    // Add entry to user_domains table
                    int userDomainId = db.addUserDomain(userId, domainId, domainName);

                    // Store userDomainId globally in DBHelper
                    db.setLoggedInUserDomain(userDomainId);

                } catch (SQLException ex) {
                    ex.printStackTrace();
                    JOptionPane.showMessageDialog(null, "Error storing domain selection in DB.");
                    return;
                }

                dispose(); // Close domain selection page
                switch (domainName) {
                    case "Information Technology":
                        new Information_Technology(); // open IT page
                        break;
                    default:
                        JOptionPane.showMessageDialog(null,
                                "Page for " + domainName + " not implemented yet.");
                }
            }

        });

        return box;
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(Domain_Selection::new);
    }
}
