# Enquête — Articulation AMP, LMMA et PSM à Madagascar

Web form (GitHub Pages) → Google Sheets (Apps Script) → R project → HTML report.
Same design and engine as the coral reef survey.

```
amp_lmma_psm_survey/
├── index.html                  # survey page
├── assets/js/survey-config.js  # ← the only file to edit for texts/questions/logos/photos
├── assets/js/app.js            # form engine (no edits needed)
├── assets/css/style.css        # design
├── assets/img/logos/           # ihsm.png, fapbm.png
├── apps-script/Code.gs         # receives answers into Google Sheets
├── tools/make_codebook.js      # regenerates analysis/codebook.csv from the questionnaire
├── tools/download_photos.R     # optional: host the photos with the site
├── analysis/                   # R project (open analysis/enquete-amp-lmma-psm.Rproj)
│   ├── R/config.R              # Sheet URL, Google account, data source
│   ├── R/01_import.R … 03_clean.R, functions.R
│   ├── report/rapport.Rmd      # descriptive report
│   └── run_all.R               # import + render both reports
└── rapport/index.html          # PUBLIC report (created by run_all.R, published with the site)
```

---

## Step 1 — Create the Google Sheet

1. In Google Drive: **New → Google Sheets**, name it e.g. `Enquete_AMP_LMMA_PSM_reponses`.
2. Copy its URL into `analysis/R/config.R` → `SHEET_URL`.
   No need to create columns: the script creates the `Reponses` tab and its columns at the first answer.

## Step 2 — Connect the Sheet to the form (Apps Script)

1. In the Sheet: **Extensions → Apps Script**. Delete the default code, paste the full content of `apps-script/Code.gs`, save.
2. (Optional) put your e-mail in `NOTIFY_EMAIL` to be notified at each answer.
3. Select the function `autoriser` → **Run** → accept the permissions (Google shows an "unverified app" warning: *Advanced → Go to project*; this is your own script).
4. **Deploy → New deployment** → type **Web app**:
   - *Execute as*: **Me**
   - *Who has access*: **Anyone**
5. Copy the URL ending in `/exec` and paste it in `assets/js/survey-config.js` → `META.appsScriptUrl`.
6. Test: open the `/exec` URL in a browser → it should show `{"ok":true,"message":"Service de collecte actif"}`.

> If you later edit `Code.gs`, use **Deploy → Manage deployments → Edit → New version** so the URL stays the same.

## Step 3 — Publish the survey (GitHub Pages)

1. Create a new **public** repository on GitHub, e.g. `amp-lmma-psm-survey` (a separate repo from the reef survey).
2. From the project folder:
   ```bash
   git init
   git add .
   git commit -m "Enquête AMP-LMMA-PSM"
   git branch -M main
   git remote add origin https://github.com/<your-account>/amp-lmma-psm-survey.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Source: Deploy from a branch → `main` / `(root)`** → Save.
4. After ~1 min the survey is online at `https://<your-account>.github.io/amp-lmma-psm-survey/`.

The `.gitignore` files keep `analysis/data/` (raw answers, internal report) and `.secrets/` (Google token) out of Git.
**Never commit those folders**: the repository is public.

*GitLab alternative*: push to a GitLab project and add a `.gitlab-ci.yml` that copies the files into `public/` (GitLab Pages). GitHub Pages is simpler.

## Step 4 — Test before sending

1. Open the online survey, fill it completely with test answers, submit.
2. Check that a row appears in the `Reponses` tab of the Sheet.
3. Delete the test row(s) in the Sheet (or keep them and filter them out in R).
4. Check on a phone too: the layout adapts to small screens.

Answers are saved as a draft in the respondent's browser, so they can stop and resume later on the same device.

## Step 5 — Analyse in R

1. Open `analysis/enquete-amp-lmma-psm.Rproj` in RStudio.
2. The first time, run `source("R/00_packages.R")` (installs missing packages).
3. **Test with fake data** (before real answers arrive): keep `DATA_SOURCE <- "simulated"` in `R/config.R`, then `source("run_all.R")`.
4. **Real data**: set `DATA_SOURCE <- "sheet"` and check `GOOGLE_EMAIL`, then `source("run_all.R")`.
   The first time, a browser window asks you to authorise access to your Google account; the token is cached in `analysis/.secrets/`.

`run_all.R` produces:

| File | Content | Publish? |
|---|---|---|
| `rapport/index.html` | aggregated results, no names, no free text | yes |
| `analysis/data/rapport_interne.html` | + institution names, free-text answers, details, duplicates check | **no** |
| `analysis/data/raw/*.csv / *.rds` | timestamped copies of the Sheet | **no** |

## Step 6 — Publish the report

After `run_all.R`, commit and push only the public report:
```bash
git add rapport/index.html
git commit -m "Mise à jour du rapport"
git push
```
It is then available at `https://<your-account>.github.io/amp-lmma-psm-survey/rapport/`.

---

## Editing the questionnaire

- Edit only `assets/js/survey-config.js`, then run `node tools/make_codebook.js` to regenerate `analysis/codebook.csv`.
- **Do not change question `id`s once data collection has started**: they are the Sheet column names and R variable names.
- If you change the questions after launch, increase `META.version` (respondents' old drafts are then ignored).

## Variables in the Sheet

One row per institution. Main conventions (full list in `analysis/codebook.csv`):

| Pattern | Meaning |
|---|---|
| `q004` | multiple choice, options separated by ` \| ` |
| `q004_autre` | text of the "Autre" option |
| `q007_amp`, `q007_lmma`, `q007_psm` | knowledge level 1–5 per scheme |
| `q010_amp` … , `q019_autorite` … | structured free-text answers |
| `q011_detail` … | details asked depending on the answer (mechanism, documents, examples) |
| `q017` | 1–5 or "Ne sait pas" (R adds `q017_num` and `q017_nsp`) |
| `q029_pourquoi` | justification of the priority mechanism |
| `response_id`, `horodatage_serveur`, `duration_min` | technical metadata |

## Photos

Photos load from Wikimedia Commons (Diego Delso, CC BY-SA 4.0; credit shown on the page).
To host them with the site, run once in R from the project root: `source("tools/download_photos.R")`, then commit `assets/img/photos/`.
To use your own photos, replace the files and update `PHOTOS` in `survey-config.js`.
