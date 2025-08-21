ALTER TABLE Utilisateur MODIFY role ENUM('DPO','Admin','Collaborateur','SuperAdmin') NOT NULL;

INSERT INTO Utilisateur (nom, role, email, mot_de_passe) VALUES
('Super Admin', 'SuperAdmin', 'super.admin@example.com', '$2a$10$DM29GNklacafTPWB.8BpIeDDJxMc8gri6uPvJkl3OEYAdCYDxFGDi');
