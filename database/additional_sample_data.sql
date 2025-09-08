-- Additional sample data for risk managmentdatabase
USE smart_dpo;

-- Insert additional users
INSERT INTO Utilisateur (nom, role, email, mot_de_passe) VALUES
('Laura Bernard', 'dpo', 'laura.bernard@example.com', '$2a$10$DM29GNklacafTPWB.8BpIeDDJxMc8gri6uPvJkl3OEYAdCYDxFGDi'),
('Thomas Petit', 'responsable du traitement', 'thomas.petit@example.com', '$2a$10$DM29GNklacafTPWB.8BpIeDDJxMc8gri6uPvJkl3OEYAdCYDxFGDi'),
('Sophie Martin', 'responsable du traitement', 'sophie.martin@example.com', '$2a$10$DM29GNklacafTPWB.8BpIeDDJxMc8gri6uPvJkl3OEYAdCYDxFGDi'),
('Lucas Dumont', 'dpo', 'lucas.dumont@example.com', '$2a$10$DM29GNklacafTPWB.8BpIeDDJxMc8gri6uPvJkl3OEYAdCYDxFGDi');

SET @id_laura = (SELECT id FROM Utilisateur WHERE email = 'laura.bernard@example.com');
SET @id_thomas = (SELECT id FROM Utilisateur WHERE email = 'thomas.petit@example.com');
SET @id_sophie = (SELECT id FROM Utilisateur WHERE email = 'sophie.martin@example.com');
SET @id_lucas = (SELECT id FROM Utilisateur WHERE email = 'lucas.dumont@example.com');

-- Insert additional treatments
INSERT INTO Traitement (nom, pole, base_legale, finalite, duree_conservation, type_dcp, nombre_personnes_concernees, utilisateur_id, statut_conformite) VALUES
('Gestion des fournisseurs', 'Achat', 'Contrat', 'Suivi et gestion des fournisseurs', 5, 'Nom, adresse, informations de contact', 300, @id_laura, 'Conforme'),
('Suivi des incidents', 'IT', 'Intérêt légitime', 'Enregistrer et suivre les incidents techniques', 3, 'Rapports d\'incident, journaux système', 80, @id_thomas, 'À vérifier'),
('Gestion des candidatures', 'RH', 'Consentement', 'Suivi des candidatures', 2, 'CV, lettre de motivation', 150, @id_sophie, 'Conforme'),
('Suivi des formations', 'RH', 'Obligation légale', 'Enregistrement des formations suivies', 5, 'Nom, formations suivies', 200, @id_lucas, 'À vérifier');

SET @traitement_fournisseurs = (SELECT id FROM Traitement WHERE nom = 'Gestion des fournisseurs');
SET @traitement_incidents = (SELECT id FROM Traitement WHERE nom = 'Suivi des incidents');
SET @traitement_candidatures = (SELECT id FROM Traitement WHERE nom = 'Gestion des candidatures');
SET @traitement_formations = (SELECT id FROM Traitement WHERE nom = 'Suivi des formations');

-- Insert additional risks
INSERT INTO Risque (traitement_id, type_risque, criticite, probabilite, impact, statut, vulnerabilites, date_analyse) VALUES
(@traitement_fournisseurs, 'Conformité', 3, 3, 4, 'Identifié', 'Clauses contractuelles insuffisantes', '2025-07-30'),
(@traitement_incidents, 'Disponibilité', 4, 2, 4, 'En cours', 'Infrastructure à point unique de défaillance', '2025-07-30'),
(@traitement_candidatures, 'Confidentialité', 2, 3, 3, 'Identifié', 'Accès non autorisé aux candidatures', '2025-07-30'),
(@traitement_formations, 'Intégrité', 3, 2, 3, 'Identifié', 'Mise à jour manuelle des dossiers', '2025-07-30');

SET @risque_fournisseurs = (SELECT id FROM Risque WHERE traitement_id = @traitement_fournisseurs AND type_risque = 'Conformité' LIMIT 1);
SET @risque_incidents = (SELECT id FROM Risque WHERE traitement_id = @traitement_incidents AND type_risque = 'Disponibilité' LIMIT 1);
SET @risque_candidatures = (SELECT id FROM Risque WHERE traitement_id = @traitement_candidatures AND type_risque = 'Confidentialité' LIMIT 1);
SET @risque_formations = (SELECT id FROM Risque WHERE traitement_id = @traitement_formations AND type_risque = 'Intégrité' LIMIT 1);

-- Insert additional corrective measures
INSERT INTO MesureCorrective (risque_id, description, type_mesure, priorite, statut, responsable_id, date_echeance) VALUES
(@risque_fournisseurs, 'Ajouter des clauses de protection des données aux contrats fournisseurs', 'Juridique', 'Haute', 'À faire', @id_laura, '2025-09-01'),
(@risque_incidents, 'Mettre en place un plan de reprise après sinistre', 'Technique', 'Critique', 'À faire', @id_thomas, '2025-09-15'),
(@risque_candidatures, 'Restreindre les droits d’accès aux dossiers de candidature', 'Organisationnelle', 'Moyenne', 'À faire', @id_sophie, '2025-08-15'),
(@risque_formations, 'Automatiser la mise à jour des dossiers de formation', 'Technique', 'Moyenne', 'À faire', @id_lucas, '2025-08-30');

-- Insert additional alerts
INSERT INTO Alerte (titre, message, type_alerte, traitement_id, risque_id, utilisateur_id) VALUES
('Clauses manquantes', 'Les contrats fournisseurs nécessitent des clauses de protection des données', 'Attention', @traitement_fournisseurs, @risque_fournisseurs, @id_laura),
('Serveur unique', 'Le traitement "Suivi des incidents" repose sur un serveur unique', 'Info', @traitement_incidents, @risque_incidents, @id_thomas),
('Accès candidature non restreint', 'Le traitement "Gestion des candidatures" a des permissions trop larges', 'Attention', @traitement_candidatures, @risque_candidatures, @id_sophie),
('Données de formation manuelles', 'Les dossiers de formation sont mis à jour manuellement', 'Info', @traitement_formations, @risque_formations, @id_lucas);

-- Insert journal actions
INSERT INTO JournalAction (utilisateur_id, traitement_id, risque_id, action, details) VALUES
(@id_laura, @traitement_fournisseurs, @risque_fournisseurs, 'Création traitement', 'Ajout du traitement Gestion des fournisseurs'),
(@id_thomas, @traitement_incidents, NULL, 'Création traitement', 'Ajout du traitement Suivi des incidents'),
(@id_sophie, @traitement_candidatures, @risque_candidatures, 'Création traitement', 'Ajout du traitement Gestion des candidatures'),
(@id_lucas, @traitement_formations, @risque_formations, 'Création traitement', 'Ajout du traitement Suivi des formations');

