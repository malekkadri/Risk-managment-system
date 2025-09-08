-- Script to add application name setting
USE smart_dpo;

CREATE TABLE IF NOT EXISTS ApplicationSettings (
    id INT PRIMARY KEY DEFAULT 1,
    app_name VARCHAR(255) NOT NULL
);

INSERT INTO ApplicationSettings (id, app_name)
VALUES (1, 'Smart DPO')
ON DUPLICATE KEY UPDATE app_name = VALUES(app_name);
