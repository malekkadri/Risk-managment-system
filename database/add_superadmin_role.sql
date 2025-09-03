ALTER TABLE Utilisateur MODIFY role ENUM('dpo','admin','responsable du traitement','super admin','sous traitant') NOT NULL;

INSERT INTO Utilisateur (nom, role, email, mot_de_passe) VALUES
('Super Admin', 'super admin', 'super.admin@example.com', '$2a$10$DM29GNklacafTPWB.8BpIeDDJxMc8gri6uPvJkl3OEYAdCYDxFGDi');
