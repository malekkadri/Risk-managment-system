ALTER TABLE Utilisateur MODIFY role ENUM('dpo','admin','responsable du traitement','super admin','sous traitant') NOT NULL;

INSERT INTO Utilisateur (nom, role, email, mot_de_passe) VALUES
('Rapporteur', 'sous traitant', 'rapport.user@example.com', '$2a$10$DM29GNklacafTPWB.8BpIeDDJxMc8gri6uPvJkl3OEYAdCYDxFGDi');

CREATE OR REPLACE VIEW vue_utilisateurs_public AS
SELECT id, nom, role, email, actif, cree_le, mis_a_jour_le
FROM Utilisateur;
