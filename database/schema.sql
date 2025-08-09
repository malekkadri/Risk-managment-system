-- Création de la base de données si elle n'existe pas
CREATE DATABASE IF NOT EXISTS smart_dpo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Utilisation de la base de données
USE smart_dpo;

-- Table: Utilisateur
CREATE TABLE IF NOT EXISTS Utilisateur (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    role ENUM('DPO', 'Admin', 'Collaborateur') NOT NULL,
    email VARCHAR(191) NOT NULL UNIQUE,  -- Réduit de 255 à 191 pour utf8mb4
    mot_de_passe VARCHAR(255) NOT NULL,
    actif BOOLEAN DEFAULT TRUE,
    cree_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    mis_a_jour_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: Traitement
CREATE TABLE IF NOT EXISTS Traitement (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    pole VARCHAR(191),  -- Réduit pour éviter les problèmes d'index
    base_legale ENUM('Consentement', 'Contrat', 'Obligation légale', 'Intérêt vital', 'Mission publique', 'Intérêt légitime') NOT NULL,
    finalite TEXT,
    duree_conservation INT COMMENT 'Durée en années',
    type_dcp TEXT COMMENT 'Types de données à caractère personnel',
    nombre_personnes_concernees INT DEFAULT 0,
    transfert_hors_ue BOOLEAN DEFAULT FALSE,
    mesures_securite TEXT,
    statut_conformite ENUM('Conforme', 'Non conforme', 'À vérifier') DEFAULT 'À vérifier',
    utilisateur_id INT,
    cree_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    mis_a_jour_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (utilisateur_id) REFERENCES Utilisateur(id) ON DELETE SET NULL,
    INDEX idx_pole (pole),
    INDEX idx_statut (statut_conformite),
    INDEX idx_base_legale (base_legale)
);

-- Table: Risque
CREATE TABLE IF NOT EXISTS Risque (
    id INT AUTO_INCREMENT PRIMARY KEY,
    traitement_id INT NOT NULL,
    type_risque ENUM('Confidentialité', 'Intégrité', 'Disponibilité', 'Conformité') NOT NULL,
    criticite INT NOT NULL COMMENT 'Échelle de 1 à 5',
    probabilite INT NOT NULL COMMENT 'Échelle de 1 à 5',
    impact INT NOT NULL COMMENT 'Échelle de 1 à 5',
    score_risque INT GENERATED ALWAYS AS (criticite * probabilite * impact) STORED,
    statut ENUM('Identifié', 'En cours', 'Traité', 'Résiduel') NOT NULL DEFAULT 'Identifié',
    vulnerabilites TEXT,
    commentaire TEXT,
    date_analyse DATE,
    date_echeance DATE,
    FOREIGN KEY (traitement_id) REFERENCES Traitement(id) ON DELETE CASCADE,
    INDEX idx_score_risque (score_risque),
    INDEX idx_statut_risque (statut),
    INDEX idx_type_risque (type_risque)
);

-- Table: MesureCorrective
CREATE TABLE IF NOT EXISTS MesureCorrective (
    id INT AUTO_INCREMENT PRIMARY KEY,
    risque_id INT NOT NULL,
    description TEXT NOT NULL,
    type_mesure ENUM('Technique', 'Organisationnelle', 'Juridique') NOT NULL,
    priorite ENUM('Basse', 'Moyenne', 'Haute', 'Critique') NOT NULL,
    statut ENUM('À faire', 'En cours', 'Terminée', 'Reportée') NOT NULL DEFAULT 'À faire',
    responsable_id INT,
    date_echeance DATE,
    cout_estime DECIMAL(10,2),
    cree_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (risque_id) REFERENCES Risque(id) ON DELETE CASCADE,
    FOREIGN KEY (responsable_id) REFERENCES Utilisateur(id) ON DELETE SET NULL,
    INDEX idx_statut_mesure (statut),
    INDEX idx_priorite (priorite),
    INDEX idx_echeance (date_echeance)
);

-- Table: JournalAction
CREATE TABLE IF NOT EXISTS JournalAction (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id INT,
    traitement_id INT,
    risque_id INT,
    action VARCHAR(191) NOT NULL,  -- Réduit pour éviter les problèmes d'index
    details TEXT,
    date_action TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (utilisateur_id) REFERENCES Utilisateur(id) ON DELETE SET NULL,
    FOREIGN KEY (traitement_id) REFERENCES Traitement(id) ON DELETE SET NULL,
    FOREIGN KEY (risque_id) REFERENCES Risque(id) ON DELETE SET NULL,
    INDEX idx_date_action (date_action),
    INDEX idx_action (action)
);

-- Table: Alerte
CREATE TABLE IF NOT EXISTS Alerte (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(191) NOT NULL,  -- Réduit pour éviter les problèmes d'index
    message TEXT NOT NULL,
    type_alerte ENUM('Info', 'Attention', 'Critique') NOT NULL,
    traitement_id INT,
    risque_id INT,
    utilisateur_id INT,
    lu BOOLEAN DEFAULT FALSE,
    cree_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (traitement_id) REFERENCES Traitement(id) ON DELETE CASCADE,
    FOREIGN KEY (risque_id) REFERENCES Risque(id) ON DELETE CASCADE,
    FOREIGN KEY (utilisateur_id) REFERENCES Utilisateur(id) ON DELETE CASCADE,
    INDEX idx_lu (lu),
    INDEX idx_type_alerte (type_alerte),
    INDEX idx_date_creation (cree_le)
);

-- Table: Rapport
CREATE TABLE IF NOT EXISTS Rapport (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(191) NOT NULL,  -- Réduit pour éviter les problèmes d'index
    type_rapport ENUM('Conformité', 'Risques', 'Activité') NOT NULL,
    contenu JSON,
    genere_par INT,
    cree_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (genere_par) REFERENCES Utilisateur(id) ON DELETE SET NULL,
    INDEX idx_type_rapport (type_rapport),
    INDEX idx_date_generation (cree_le)
);

-- Insertion de données d'exemple avec mots de passe hashés
-- Mot de passe: "password123" hashé avec bcrypt
INSERT INTO Utilisateur (nom, role, email, mot_de_passe) VALUES
('Jean Dupont', 'DPO', 'jean.dupont@example.com', '$2b$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQ'),
('Marie Curie', 'Admin', 'marie.curie@example.com', '$2b$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQ'),
('Pierre Martin', 'Collaborateur', 'pierre.martin@example.com', '$2b$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQ');

INSERT INTO Traitement (nom, pole, base_legale, finalite, duree_conservation, type_dcp, nombre_personnes_concernees, utilisateur_id, statut_conformite) VALUES
('Gestion de la paie', 'RH', 'Obligation légale', 'Établir les bulletins de paie des employés', 5, 'Nom, prénom, adresse, numéro de sécurité sociale, salaire', 150, 1, 'Conforme'),
('Recrutement candidats', 'RH', 'Consentement', 'Gérer les candidatures pour les postes ouverts', 2, 'CV, lettre de motivation, coordonnées', 500, 1, 'À vérifier'),
('Newsletter Marketing', 'Marketing', 'Consentement', 'Envoyer des informations commerciales aux clients inscrits', 3, 'Email, nom, prénom', 2000, 2, 'Non conforme'),
('Gestion des clients', 'Commercial', 'Contrat', 'Gérer la relation client et les commandes', 7, 'Nom, prénom, adresse, téléphone, historique achats', 1200, 2, 'Conforme'),
('Vidéosurveillance', 'Sécurité', 'Intérêt légitime', 'Assurer la sécurité des locaux', 1, 'Images de vidéosurveillance', 0, 1, 'À vérifier');

INSERT INTO Risque (traitement_id, type_risque, criticite, probabilite, impact, statut, vulnerabilites, date_analyse) VALUES
(1, 'Confidentialité', 4, 3, 4, 'Identifié', 'Accès non autorisé aux données salariales sensibles', '2025-07-30'),
(2, 'Conformité', 3, 4, 3, 'En cours', 'Base légale insuffisante pour certains traitements', '2025-07-25'),
(3, 'Confidentialité', 2, 2, 3, 'Traité', 'Désinscription non fonctionnelle', '2025-06-15'),
(4, 'Intégrité', 3, 2, 4, 'Identifié', 'Risque de modification non autorisée des données client', '2025-07-28'),
(5, 'Disponibilité', 4, 3, 3, 'Identifié', 'Système de sauvegarde défaillant', '2025-07-29');

INSERT INTO MesureCorrective (risque_id, description, type_mesure, priorite, statut, responsable_id, date_echeance) VALUES
(1, 'Mettre en place une authentification à deux facteurs (MFA)', 'Technique', 'Haute', 'À faire', 1, '2025-08-15'),
(2, 'Réviser les mentions légales et obtenir les consentements manquants', 'Juridique', 'Critique', 'En cours', 2, '2025-08-10'),
(3, 'Corriger le mécanisme de désinscription automatique', 'Technique', 'Moyenne', 'Terminée', 2, '2025-07-01'),
(4, 'Implémenter un système de logs d\'audit', 'Technique', 'Haute', 'À faire', 1, '2025-08-20'),
(5, 'Mettre en place une sauvegarde automatique quotidienne', 'Technique', 'Critique', 'À faire', 1, '2025-08-05');

INSERT INTO Alerte (titre, message, type_alerte, traitement_id, risque_id, utilisateur_id) VALUES
('Risque critique détecté', 'Le traitement "Gestion de la paie" présente un risque de sécurité élevé', 'Critique', 1, 1, 1),
('Échéance proche', 'La mesure corrective pour le système de sauvegarde arrive à échéance dans 5 jours', 'Attention', 5, 5, 1),
('Nouveau traitement à vérifier', 'Le traitement "Recrutement des candidats" nécessite une vérification de conformité', 'Info', 2, NULL, 1);

-- Optimisations pour les performances
-- Vues pour les requêtes fréquentes
CREATE VIEW vue_traitements_risques AS
SELECT 
    t.id,
    t.nom,
    t.pole,
    t.statut_conformite,
    COUNT(r.id) as nombre_risques,
    AVG(r.score_risque) as score_moyen_risque,
    MAX(r.score_risque) as score_max_risque
FROM Traitement t
LEFT JOIN Risque r ON t.id = r.traitement_id
GROUP BY t.id, t.nom, t.pole, t.statut_conformite;

-- Vue pour les statistiques du tableau de bord
CREATE VIEW vue_stats_dashboard AS
SELECT 
    (SELECT COUNT(*) FROM Traitement) as total_traitements,
    (SELECT COUNT(*) FROM Risque WHERE score_risque >= 80) as risques_critiques,
    (SELECT COUNT(*) FROM MesureCorrective WHERE statut != 'Terminée') as mesures_en_cours,
    (SELECT COUNT(*) FROM Alerte WHERE lu = FALSE) as alertes_non_lues;

-- Procédure stockée pour nettoyer les anciennes alertes
DELIMITER //
CREATE PROCEDURE CleanOldAlerts()
BEGIN
    DELETE FROM Alerte 
    WHERE lu = TRUE 
    AND cree_le < DATE_SUB(NOW(), INTERVAL 30 DAY);
END //
DELIMITER ;

-- Événement pour nettoyer automatiquement les alertes anciennes (optionnel)
-- SET GLOBAL event_scheduler = ON;
-- CREATE EVENT IF NOT EXISTS clean_old_alerts
-- ON SCHEDULE EVERY 1 WEEK
-- DO CALL CleanOldAlerts();
