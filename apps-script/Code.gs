/**
 * Réception des réponses de l'enquête « articulation AMP – LMMA – PSM » → Google Sheets
 * ------------------------------------------------------------------------------
 * À coller dans : Google Sheet > Extensions > Apps Script (script lié à la feuille).
 * Voir README.md, étape 2, pour le déploiement en « Application Web ».
 *
 * Onglets créés automatiquement :
 *   - Reponses : une ligne par institution répondante (sections A à F)
 *   - Journal  : erreurs éventuelles
 * Les colonnes manquantes sont ajoutées à la volée : modifier le questionnaire
 * ne nécessite pas de modifier ce script.
 */

const SHEET_RESPONSES = "Reponses";
const SHEET_LOG = "Journal";
// Facultatif : adresse e-mail qui reçoit une notification à chaque réponse
const NOTIFY_EMAIL = "";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const data = JSON.parse(e.postData.contents);

    // Champ piège anti-robots : rempli = soumission ignorée
    if (data.website) return json_({ ok: true });
    if (!data.response_id || !data.general) throw new Error("Données incomplètes");

    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Doublon (double-clic, renvoi après coupure réseau) : on ne réenregistre pas
    if (alreadyStored_(ss, data.response_id)) return json_({ ok: true, duplicate: true, id: data.response_id });

    const meta = {
      response_id: data.response_id,
      horodatage_serveur: new Date(),
      survey_version: data.survey_version,
      started_at: data.started_at,
      submitted_at_client: data.submitted_at_client,
      duration_min: data.duration_min
    };
    appendObject_(ss, SHEET_RESPONSES, Object.assign({}, meta, data.general));

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail(NOTIFY_EMAIL, "Enquête AMP-LMMA-PSM — nouvelle réponse",
        "Institution : " + (data.general.q002 || "?") + "\nFonction : " + (data.general.q001 || "?") + "\nRéférence : " + data.response_id.slice(0, 8).toUpperCase());
    }
    return json_({ ok: true, id: data.response_id });
  } catch (err) {
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const log = ss.getSheetByName(SHEET_LOG) || ss.insertSheet(SHEET_LOG);
      log.appendRow([new Date(), String(err), (e && e.postData) ? e.postData.contents.slice(0, 2000) : ""]);
    } catch (ignored) {}
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Test rapide : ouvrir l'URL /exec dans le navigateur doit afficher {"ok":true,...}
function doGet() {
  return json_({ ok: true, message: "Service de collecte actif" });
}

/* ----------------------------------------------------------------- utilitaires */

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function alreadyStored_(ss, id) {
  const sh = ss.getSheetByName(SHEET_RESPONSES);
  if (!sh || sh.getLastRow() < 2) return false;
  const found = sh.getRange(2, 1, sh.getLastRow() - 1, 1).createTextFinder(id).matchEntireCell(true).findNext();
  return !!found;
}

/** Ajoute une ligne ; crée les colonnes manquantes à la volée (l'ordre des colonnes reste stable). */
function appendObject_(ss, name, obj) {
  const sh = ss.getSheetByName(name) || ss.insertSheet(name);
  const lastCol = sh.getLastColumn();
  let headers = lastCol > 0 ? sh.getRange(1, 1, 1, lastCol).getValues()[0] : [];
  const missing = Object.keys(obj).filter(function (k) { return headers.indexOf(k) === -1; });
  if (missing.length) {
    headers = headers.concat(missing);
    sh.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold");
    sh.setFrozenRows(1);
  }
  const row = headers.map(function (h) { return clean_(obj[h]); });
  // Format texte pour éviter les conversions automatiques (« 1–3 », « 2; 3 », dates…)
  const range = sh.getRange(sh.getLastRow() + 1, 1, 1, row.length);
  range.setNumberFormat("@");
  const iDate = headers.indexOf("horodatage_serveur");
  if (iDate >= 0) range.getCell(1, iDate + 1).setNumberFormat("yyyy-mm-dd hh:mm:ss");
  range.setValues([row]);
}

/** Évite l'interprétation en formule (=, +, -, @). */
function clean_(v) {
  if (v === undefined || v === null) return "";
  if (v instanceof Date || typeof v === "number" || typeof v === "boolean") return v;
  const s = String(v);
  if (/^[=+\-@]/.test(s)) return "'" + s;
  return s;
}

/** À exécuter une fois depuis l'éditeur pour accorder les autorisations. */
function autoriser() {
  SpreadsheetApp.getActiveSpreadsheet().getName();
  if (NOTIFY_EMAIL) MailApp.getRemainingDailyQuota();
}
