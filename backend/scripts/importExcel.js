const path = require('path');
const XLSX = require('xlsx');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Load env from backend/.env if present
dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function main() {
  const file = process.argv[2] || path.join(__dirname, '..', '..', 'RGPD- Registre des traitements- (1).xlsx');
  const workbook = XLSX.readFile(file);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'smart_dpo',
  });

  for (const row of rows) {
    const nom = row['Nom du Traitement'];
    if (!nom) continue;

    const pole = row["Nom de l'organisation"] || null;
    const finalite = row['Finalité (Description)'] || null;

    const baseLegaleText = (row['Base Légale'] || '').toLowerCase();
    let base_legale = null;
    if (baseLegaleText.includes('obligation')) base_legale = 'Obligation légale';
    else if (baseLegaleText.includes('contrat')) base_legale = 'Contrat';
    else if (baseLegaleText.includes('légitime')) base_legale = 'Intérêt légitime';
    else if (baseLegaleText.includes('consent')) base_legale = 'Consentement';
    else if (baseLegaleText.includes('intérêt vital')) base_legale = 'Intérêt vital';
    else if (baseLegaleText.includes('mission')) base_legale = 'Mission publique';

    const type_dcp = row['Catégories de données personnelles collectées'] || null;
    const dureeText = row['Durée de conservation'] || '';
    const dureeMatch = dureeText.match(/\d+/);
    const duree_conservation = dureeMatch ? parseInt(dureeMatch[0], 10) : null;
    const transfert_hors_ue = /oui/i.test(row['Transfert hors UE \r\n(O/N + PAYS + GARANTIES)'] || '');
    const mesures_securite = row['Mesures de sécurité (Description)'] || null;
    const statut_conformite = /oui/i.test(row['Conformité RGPD (O/N + Explication)'] || '') ? 'Conforme' : 'Non conforme';

    await connection.execute(
      `INSERT INTO Traitement (nom, pole, base_legale, finalite, duree_conservation, type_dcp, nombre_personnes_concernees, transfert_hors_ue, mesures_securite, statut_conformite)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE pole=VALUES(pole), base_legale=VALUES(base_legale), finalite=VALUES(finalite), duree_conservation=VALUES(duree_conservation), type_dcp=VALUES(type_dcp), nombre_personnes_concernees=VALUES(nombre_personnes_concernees), transfert_hors_ue=VALUES(transfert_hors_ue), mesures_securite=VALUES(mesures_securite), statut_conformite=VALUES(statut_conformite)`,
      [nom, pole, base_legale, finalite, duree_conservation, type_dcp, 0, transfert_hors_ue, mesures_securite, statut_conformite]
    );
  }

  await connection.end();
  console.log('Import terminé');
}

main().catch(err => {
  console.error('Erreur lors de l\'import:', err);
  process.exit(1);
});
