// Génère analysis/codebook.csv à partir de assets/js/survey-config.js
// Usage (depuis la racine du projet) : node tools/make_codebook.js
// À relancer après toute modification des questions.
const path = require("path"), fs = require("fs");
const S = require(path.join(__dirname, "../assets/js/survey-config.js"));
const rows = [];
const q = v => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`;
for (const st of S.STEPS) {
  for (const x of st.questions) {
    const opts = x.options || [];
    const cond = x.showIf ? JSON.stringify(x.showIf) : "";
    const base = { sheet: "Reponses", section: st.key, step: st.title, n: x.n, required: x.required ? "Oui" : "Non", condition: cond };
    if (x.type === "grid" || x.type === "matrix" || x.type === "fields") {
      for (const r of x.rows) rows.push({ ...base, variable: `${x.id}_${r.key}`, label: `${x.label} — ${r.label}`, type: x.type,
        options: x.type === "matrix" ? opts.join(" | ") : "", required: x.required && !r.optional && x.type !== "fields" ? "Oui" : "Non" });
      continue;
    }
    rows.push({ ...base, variable: x.id, label: x.label, type: x.type,
      options: opts.concat(x.extra ? [x.extra] : []).join(" | ") });
    if (x.units) rows.push({ ...base, variable: x.id + "_unite", label: x.label + " — unité", type: "unit", options: x.units.join(" | ") });
    if (x.other) rows.push({ ...base, variable: x.id + "_autre", label: x.label + " — précision (Autre)", type: "text", options: "", required: "Non" });
    if (x.explain) rows.push({ ...base, variable: x.id + "_pourquoi", label: x.label + " — " + x.explain, type: "textarea", options: "", required: x.explainRequired ? "Oui" : "Non" });
    if (x.detail) {
      const dc = x.detail.showIf ? JSON.stringify(Object.assign({ q: x.id }, x.detail.showIf)) : cond;
      rows.push({ ...base, variable: x.id + "_detail", label: x.label + " — " + x.detail.label, type: x.detail.type === "number" ? "number" : "textarea",
        options: "", required: x.detail.required ? "Oui" : "Non", condition: dc });
    }
  }
}
const cols = ["sheet", "variable", "n", "section", "step", "label", "type", "options", "required", "condition"];
const csv = [cols.join(",")].concat(rows.map(r => cols.map(c => q(r[c])).join(","))).join("\n");
fs.writeFileSync(path.join(__dirname, "../analysis/codebook.csv"), csv + "\n", "utf8");
console.log(rows.length + " variables écrites dans analysis/codebook.csv");
