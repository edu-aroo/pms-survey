/* =====================================================================
   CONFIGURATION DE L'ENQUÊTE « ARTICULATION AMP – LMMA – PSM »
   Fichier unique à modifier (textes, questions, logos, photos)
   ---------------------------------------------------------------------
   • META   : titre, textes d'accueil, contact, logos, photos, URL Apps Script
   • PHOTOS : photos du bandeau, de l'accueil et des sections (avec crédits)
   • STEPS  : sections A à F et questions (d'après Fiche_enquete_AMP_LMMA_PSM.xlsx)
   Les identifiants (id) deviennent les noms de colonnes dans Google Sheets
   et les noms de variables dans R : ne pas les modifier une fois la
   collecte lancée.

   Types : text, textarea, number, radio, checkbox,
           scale  (1–5 ; extra: 'Ne sait pas' ajoute une case hors échelle)
           matrix (plusieurs lignes notées sur la même échelle → id_ligne)
           fields (plusieurs champs texte → id_ligne)
   Options :
     other: true      → champ texte quand « Autre » est coché (id_autre)
     explain: '...'   → champ « Pourquoi ? » (id_pourquoi) ; explainRequired: true
     detail: {label, type:'text'|'textarea', showIf, required}
                      → précision complémentaire (id_detail). showIf porte sur la
                        réponse à la question elle-même, ex. { starts:'Oui' }
     max: n           → nombre maximal de cases à cocher
     showIf           → { q:'q008', in:[...] } | { q:'q011', starts:'Oui' } | { q, eq } | { q, ne }
     Les options « Aucun… » et « Ne sait pas » d'un choix multiple sont exclusives.
   ===================================================================== */

const SURVEY = {
  META: {
    "version": "1.0",
    "title": "Enquête sur l'articulation entre AMP, LMMA et planification spatiale marine (PSM) à Madagascar",
    "subtitle": "Coordination, gouvernance, données et perspectives des institutions impliquées dans la gestion de l'espace marin",
    "organizer": "Fondation pour les Aires Protégées et la Biodiversité de Madagascar (FAPBM), en collaboration avec l’Institut Halieutique et des Sciences Marines (IH.SM) – Université de Toliara",
    "contactName": "Nomenisoa Aina Le Don",
    "contactEmail": "ainaledon.nomenisoa@gmail.com",
    "deadline": "15 Novembre",
    "estimatedTime": "30 à 45 min",
    // URL de l'application Web Apps Script (README, étape 2). Vide = envoi désactivé.
    "appsScriptUrl": "https://script.google.com/macros/s/AKfycbzP677mqaml4tsHx6H3MPJtF9-Ajn-B8roqgyp7Yj-5YkK9hSTdmluvCqutw-8m76PUrA/exec",
    "logos": [
      { "src": "assets/img/logos/ihsm.png", "alt": "IH.SM — Université de Toliara", "url": "https://ihsm.mg/" },
      { "src": "assets/img/logos/fapbm.png", "alt": "FAPBM", "url": "https://www.fapbm.org/en/home/" }
    ],
    "intro": [
      "Cette enquête vise à comprendre comment les aires marines protégées (AMP), les aires marines gérées localement (LMMA) et la planification spatiale marine (PSM) s'articulent à Madagascar : connaissance des dispositifs, mécanismes de coordination, gouvernance et réglementation, données et capacités techniques, obstacles et pistes d'amélioration.",
      "Elle s'adresse aux institutions publiques, gestionnaires d'AMP et de LMMA, ONG, associations, instituts de recherche et partenaires impliqués dans la gestion de l'espace marin et côtier.",
      "Une seule réponse par institution, de préférence par la personne la mieux placée pour décrire ses pratiques. Il n'y a pas de bonne ou de mauvaise réponse : décrivez la situation telle que vous la connaissez."
    ],
    "draftNote": "Vos réponses sont enregistrées automatiquement sur cet appareil : vous pouvez interrompre la saisie et la reprendre plus tard depuis le même navigateur.",
    "privacy": "Les informations recueillies servent uniquement à cette étude. Les résultats seront présentés de manière agrégée, sans citer nommément les personnes ni les institutions.",
    "consentLabel": "J'accepte que les informations fournies soient utilisées dans le cadre de cette étude, selon les conditions décrites ci-dessus.",
    "heroPhoto": "nosy-iranja",
    "introPhotos": ["nosy-komba", "poisson-seche", "recif-acropora"],
    "thanksPhoto": "nosy-antanimora",
    "photoCreditNote": "Photographies : Diego Delso (delso.photo), Wikimedia Commons, licence CC BY-SA 4.0 — nord-ouest de Madagascar, septembre 2025."
  },

  PHOTOS: [
    {
      "key": "nosy-iranja",
      "src": "assets/img/photos/nosy-iranja.jpg",
      "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Nosy_Iranja%2C_Madagascar%2C_2025-09-17%2C_DD_21.jpg/1280px-Nosy_Iranja%2C_Madagascar%2C_2025-09-17%2C_DD_21.jpg",
      "caption": "Nosy Iranja",
      "credit": "Diego Delso", "license": "CC BY-SA 4.0",
      "page": "https://commons.wikimedia.org/wiki/File:Nosy_Iranja,_Madagascar,_2025-09-17,_DD_21.jpg"
    },
    {
      "key": "nosy-komba",
      "src": "assets/img/photos/nosy-komba.jpg",
      "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Nosy_Komba%2C_Madagascar%2C_2025-09-12%2C_DD_48.jpg/1280px-Nosy_Komba%2C_Madagascar%2C_2025-09-12%2C_DD_48.jpg",
      "caption": "Nosy Komba",
      "credit": "Diego Delso", "license": "CC BY-SA 4.0",
      "page": "https://commons.wikimedia.org/wiki/File:Nosy_Komba,_Madagascar,_2025-09-12,_DD_48.jpg"
    },
    {
      "key": "poisson-seche",
      "src": "assets/img/photos/poisson-seche.jpg",
      "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Ambatoxavavyand%2C_Nosy_Be%2C_Madagascar%2C_2025-09-21%2C_DD_06.jpg/1280px-Ambatoxavavyand%2C_Nosy_Be%2C_Madagascar%2C_2025-09-21%2C_DD_06.jpg",
      "caption": "Séchage du poisson, Nosy Be",
      "credit": "Diego Delso", "license": "CC BY-SA 4.0",
      "page": "https://commons.wikimedia.org/wiki/File:Ambatoxavavyand,_Nosy_Be,_Madagascar,_2025-09-21,_DD_06.jpg"
    },
    {
      "key": "recif-acropora",
      "src": "assets/img/photos/recif-acropora.jpg",
      "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Coral_%28Acropora_clathrata%29%2C_Nosy_Iranja%2C_Madagascar%2C_2025-09-17%2C_DD_53.jpg/1280px-Coral_%28Acropora_clathrata%29%2C_Nosy_Iranja%2C_Madagascar%2C_2025-09-17%2C_DD_53.jpg",
      "caption": "Récif à Acropora, Nosy Iranja",
      "credit": "Diego Delso", "license": "CC BY-SA 4.0",
      "page": "https://commons.wikimedia.org/wiki/File:Coral_%28Acropora_clathrata%29%2C_Nosy_Iranja%2C_Madagascar%2C_2025-09-17%2C_DD_53.jpg"
    },
    {
      "key": "ambalihabe",
      "src": "assets/img/photos/ambalihabe.jpg",
      "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Ambalihabe%2C_Madagascar%2C_2025-09-16%2C_DD_08.jpg/1280px-Ambalihabe%2C_Madagascar%2C_2025-09-16%2C_DD_08.jpg",
      "caption": "Ambalihabe",
      "credit": "Diego Delso", "license": "CC BY-SA 4.0",
      "page": "https://commons.wikimedia.org/wiki/File:Ambalihabe,_Madagascar,_2025-09-16,_DD_08.jpg"
    },
    {
      "key": "nosy-kalakajoro",
      "src": "assets/img/photos/nosy-kalakajoro.jpg",
      "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Nosy_Kalakajoro%2C_Madagascar%2C_2025-09-14%2C_DD_11.jpg/1280px-Nosy_Kalakajoro%2C_Madagascar%2C_2025-09-14%2C_DD_11.jpg",
      "caption": "Nosy Kalakajoro",
      "credit": "Diego Delso", "license": "CC BY-SA 4.0",
      "page": "https://commons.wikimedia.org/wiki/File:Nosy_Kalakajoro,_Madagascar,_2025-09-14,_DD_11.jpg"
    },
    {
      "key": "ampasipohy",
      "src": "assets/img/photos/ampasipohy.jpg",
      "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Ampasipohy%2C_Nosy_Be%2C_Madagascar%2C_2025-09-21%2C_DD_17.jpg/1280px-Ampasipohy%2C_Nosy_Be%2C_Madagascar%2C_2025-09-21%2C_DD_17.jpg",
      "caption": "Ampasipohy, Nosy Be",
      "credit": "Diego Delso", "license": "CC BY-SA 4.0",
      "page": "https://commons.wikimedia.org/wiki/File:Ampasipohy,_Nosy_Be,_Madagascar,_2025-09-21,_DD_17.jpg"
    },
    {
      "key": "nosy-antanimora",
      "src": "assets/img/photos/nosy-antanimora.jpg",
      "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Nosy_Antanimora%2C_Madagascar%2C_2025-09-15%2C_DD_14.jpg/1280px-Nosy_Antanimora%2C_Madagascar%2C_2025-09-15%2C_DD_14.jpg",
      "caption": "Nosy Antanimora",
      "credit": "Diego Delso", "license": "CC BY-SA 4.0",
      "page": "https://commons.wikimedia.org/wiki/File:Nosy_Antanimora,_Madagascar,_2025-09-15,_DD_14.jpg"
    }
  ],

  STEPS: [
    /* ------------------------------------------------------------- A */
    {
      "key": "A",
      "title": "Profil du répondant",
      "short": "Profil du répondant",
      "questions": [
        { "id": "q001", "n": 1, "label": "Quelle est votre fonction actuelle au sein de votre institution ?", "type": "text", "required": true,
          "help": "Intitulé exact de votre fonction." },
        { "id": "q002", "n": 2, "label": "Quelle est votre institution ou organisation ?", "type": "text", "required": true,
          "help": "Nom officiel de l'institution (et sigle le cas échéant)." },
        { "id": "q003", "n": 3, "label": "Depuis combien de temps travaillez-vous dans ce domaine ?", "type": "radio", "required": true,
          "options": ["Moins de 2 ans", "2 à 5 ans", "6 à 10 ans", "Plus de 10 ans"] },
        { "id": "q004", "n": 4, "label": "Dans quels domaines votre institution intervient-elle ?", "type": "checkbox", "required": true,
          "help": "Cochez toutes les réponses pertinentes.",
          "options": ["Création/gestion d'AMP", "Gestion de LMMA", "Planification spatiale marine (PSM)", "Gestion des pêches",
            "Conservation de la biodiversité", "Aménagement du littoral", "Données spatiales/SIG", "Autre"], "other": true },
        { "id": "q005", "n": 5, "label": "Quel est le niveau géographique principal de votre intervention ?", "type": "radio", "required": true,
          "options": ["Local/communautaire", "Communal/intercommunal", "Régional", "National", "International/inter-pays"] },
        { "id": "q006", "n": 6, "label": "Quelle est la zone géographique principale couverte par votre travail ?", "type": "text", "required": true,
          "help": "Précisez la région, la commune, le site ou l'aire maritime." }
      ]
    },

    /* ------------------------------------------------------------- B */
    {
      "key": "B",
      "title": "Connaissance des dispositifs",
      "short": "Connaissance des dispositifs",
      "questions": [
        { "id": "q007", "n": 7, "label": "Quel est le niveau de connaissance de votre institution pour chacun des dispositifs suivants ?", "type": "matrix", "required": true,
          "help": "Indiquez un niveau pour chaque dispositif.",
          "rows": [
            { "key": "amp", "label": "AMP — Aire marine protégée" },
            { "key": "lmma", "label": "LMMA — Aire marine gérée localement" },
            { "key": "psm", "label": "PSM — Planification spatiale marine" }
          ],
          "options": ["Ne connaît pas", "En a entendu parler", "Connaît les principes", "Participe à la mise en œuvre", "Coordonne ou planifie"] },
        { "id": "q008", "n": 8, "label": "Votre institution dispose-t-elle de documents opérationnels relatifs aux AMP, aux LMMA ou à la PSM ?", "type": "radio", "required": true,
          "options": ["Oui", "Non", "En cours d'élaboration", "Ne sait pas"] },
        { "id": "q009", "n": 9, "label": "Quels documents sont disponibles ou en cours d'élaboration ?", "type": "checkbox", "required": true,
          "options": ["Plan de gestion", "Plan de zonage", "Atlas maritime", "Carte des usages", "Texte réglementaire",
            "Accord de gestion communautaire", "Base de données SIG", "Autre", "Aucun"], "other": true,
          "detail": { "label": "Si possible, précisez le titre, la date, l'institution responsable et la disponibilité des documents", "type": "textarea" },
          "showIf": { "q": "q008", "in": ["Oui", "En cours d'élaboration"] } },
        { "id": "q010", "n": 10, "label": "Selon vous, quel est le rôle principal de chacun des dispositifs AMP, LMMA et PSM ?", "type": "fields", "required": true,
          "help": "Répondez avec vos propres mots, en une ou deux phrases par dispositif. Laissez vide un dispositif que vous ne connaissez pas.",
          "rows": [
            { "key": "amp", "label": "AMP" },
            { "key": "lmma", "label": "LMMA" },
            { "key": "psm", "label": "PSM" }
          ] }
      ]
    },

    /* ------------------------------------------------------------- C */
    {
      "key": "C",
      "title": "Articulation AMP – LMMA – PSM",
      "short": "Articulation AMP–LMMA–PSM",
      "questions": [
        { "id": "q011", "n": 11, "label": "Existe-t-il, dans votre zone d'intervention, des mécanismes formels de coordination entre les gestionnaires d'AMP, les gestionnaires de LMMA et les acteurs de la PSM ?", "type": "radio", "required": true,
          "options": ["Oui, régulièrement", "Oui, occasionnellement", "Non", "En cours de mise en place", "Ne sait pas"],
          "detail": { "label": "Nom du mécanisme, participants et document qui l'atteste (arrêté, procès-verbal, convention…)", "type": "textarea", "showIf": { "in": ["Oui, régulièrement", "Oui, occasionnellement", "En cours de mise en place"] } } },
        { "id": "q012", "n": 12, "label": "Les limites géographiques des AMP et des LMMA sont-elles prises en compte dans les documents ou processus de PSM ?", "type": "radio", "required": true,
          "options": ["Systématiquement", "Partiellement", "Rarement", "Jamais", "Ne sait pas", "Aucun processus de PSM identifié"] },
        { "id": "q013", "n": 13, "label": "Les plans de gestion des AMP et des LMMA sont-ils compatibles avec les orientations spatiales définies à une échelle plus large ?", "type": "radio", "required": true,
          "options": ["Oui, entièrement", "Oui, partiellement", "Non", "Aucun cadre commun identifié", "Ne sait pas"],
          "detail": { "label": "Exemple ou document permettant d'étayer votre réponse", "type": "textarea", "showIf": { "in": ["Oui, entièrement", "Oui, partiellement", "Non"] } } },
        { "id": "q014", "n": 14, "label": "Votre institution participe-t-elle à des réunions ou consultations réunissant les acteurs des AMP, des LMMA et de la PSM ?", "type": "radio", "required": true,
          "options": ["Régulièrement", "Occasionnellement", "Rarement", "Jamais", "Ne sait pas"],
          "detail": { "label": "Fréquence et date (approximative) de la dernière réunion", "type": "text", "showIf": { "in": ["Régulièrement", "Occasionnellement", "Rarement"] } } },
        { "id": "q015", "n": 15, "label": "Existe-t-il des conflits, chevauchements ou contradictions entre les règles applicables aux AMP, aux LMMA et aux autres usages de l'espace marin ?", "type": "radio", "required": true,
          "options": ["Oui", "Non", "Ne sait pas"],
          "detail": { "label": "Décrivez la nature du problème, les secteurs concernés et un exemple précis", "type": "textarea", "required": true, "showIf": { "eq": "Oui" } } },
        { "id": "q016", "n": 16, "label": "Les limites et règles des AMP/LMMA influencent-elles concrètement les décisions concernant les autres usages maritimes ?", "type": "radio", "required": true,
          "help": "Il s'agit d'une influence réelle sur les décisions (pêche, tourisme, transport, mines, aquaculture…), et non de la simple présence des limites sur une carte.",
          "options": ["Toujours", "Souvent", "Parfois", "Rarement", "Jamais", "Ne sait pas"] }
      ]
    },

    /* ------------------------------------------------------------- D */
    {
      "key": "D",
      "title": "Gouvernance et réglementation",
      "short": "Gouvernance et réglementation",
      "questions": [
        { "id": "q017", "n": 17, "label": "Les responsabilités des institutions impliquées dans les AMP, les LMMA et la PSM sont-elles clairement définies ?", "type": "scale", "required": true,
          "help": "Indiquez votre degré d'accord avec cette affirmation.",
          "options": ["Pas du tout d'accord", "Plutôt pas d'accord", "Ni d'accord ni en désaccord", "Plutôt d'accord", "Tout à fait d'accord"],
          "extra": "Ne sait pas" },
        { "id": "q018", "n": 18, "label": "Existe-t-il un cadre juridique ou réglementaire facilitant l'intégration des AMP et des LMMA dans la PSM ?", "type": "radio", "required": true,
          "options": ["Oui, clairement établi", "Oui, mais incomplet", "Non", "En cours d'élaboration", "Ne sait pas"],
          "detail": { "label": "Références des textes concernés (loi, décret, arrêté…)", "type": "textarea", "showIf": { "in": ["Oui, clairement établi", "Oui, mais incomplet", "En cours d'élaboration"] } } },
        { "id": "q019", "n": 19, "label": "Qui prend la décision finale lorsqu'un conflit d'usage concerne une AMP ou une LMMA et un autre secteur maritime ?", "type": "fields", "required": true,
          "help": "Plusieurs acteurs peuvent intervenir : indiquez l'autorité qui tranche en dernier ressort et, séparément, les acteurs consultés. Si vous ne savez pas, écrivez « Ne sait pas ».",
          "rows": [
            { "key": "autorite", "label": "Institution / autorité qui décide" },
            { "key": "niveau", "label": "Niveau de décision (local, communal, régional, national…)" },
            { "key": "base", "label": "Base juridique ou procédure" },
            { "key": "consultes", "label": "Acteurs consultés", "optional": true }
          ] },
        { "id": "q020", "n": 20, "label": "Les communautés locales participent-elles effectivement aux décisions de planification et de gestion spatiale ?", "type": "radio", "required": true,
          "options": ["Toujours", "Souvent", "Parfois", "Rarement", "Jamais", "Ne sait pas"] },
        { "id": "q020b", "n": "20b", "label": "Le plus souvent, sous quelle forme les communautés participent-elles ?", "type": "radio", "required": false,
          "options": ["Consultation", "Participation à la décision", "Pouvoir de décision", "Ne sait pas"],
          "showIf": { "q": "q020", "in": ["Toujours", "Souvent", "Parfois", "Rarement"] } },
        { "id": "q021", "n": 21, "label": "Existe-t-il un mécanisme de résolution des conflits entre autorités publiques, gestionnaires d'aires et usagers ?", "type": "radio", "required": true,
          "options": ["Oui, formalisé", "Oui, informel", "Non", "Ne sait pas"],
          "detail": { "label": "Précisez le mécanisme, les personnes responsables et un exemple de recours", "type": "textarea", "showIf": { "starts": "Oui" } } }
      ]
    },

    /* ------------------------------------------------------------- E */
    {
      "key": "E",
      "title": "Données et capacités techniques",
      "short": "Données et capacités",
      "questions": [
        { "id": "q022", "n": 22, "label": "Votre institution dispose-t-elle de données géographiques sur les AMP, les LMMA et les usages maritimes ?", "type": "radio", "required": true,
          "options": ["Oui, pour les trois domaines", "Oui, pour deux domaines", "Oui, pour un domaine", "Non", "Ne sait pas"],
          "detail": { "label": "Thèmes des données, échelle, date et format (shapefile, KML, tableur…)", "type": "textarea", "showIf": { "starts": "Oui" } } },
        { "id": "q023", "n": 23, "label": "Ces données sont-elles partagées avec les autres institutions concernées ?", "type": "radio", "required": true,
          "options": ["Systématiquement", "Partiellement", "Rarement", "Jamais", "Ne sait pas", "Aucune donnée disponible"] },
        { "id": "q024", "n": 24, "label": "Quels outils sont utilisés pour soutenir les décisions spatiales ?", "type": "checkbox", "required": true,
          "options": ["SIG/cartographie", "Télédétection satellitaire", "Cartographie participative", "Bases de données sur les usages",
            "Suivi écologique/halieutique", "Analyse des conflits d'usage", "Autre", "Aucun"], "other": true,
          "detail": { "label": "Logiciels, produits ou procédures utilisés, si pertinent", "type": "text" } },
        { "id": "q025", "n": 25, "label": "Quels sont les principaux obstacles techniques à l'intégration des dispositifs ?", "type": "checkbox", "required": true,
          "help": "Plusieurs réponses possibles.",
          "options": ["Manque de données", "Données incompatibles/non harmonisées", "Manque de personnel qualifié", "Manque de financement",
            "Accès limité aux données", "Absence d'outils communs", "Autre"], "other": true },
        { "id": "q026", "n": 26, "label": "Les ressources humaines, financières et matérielles de votre institution sont-elles suffisantes pour assurer cette coordination ?", "type": "radio", "required": true,
          "options": ["Suffisantes", "Partiellement suffisantes", "Insuffisantes", "Inexistantes", "Ne sait pas"] }
      ]
    },

    /* ------------------------------------------------------------- F */
    {
      "key": "F",
      "title": "Perspectives et recommandations",
      "short": "Perspectives",
      "questions": [
        { "id": "q027", "n": 27, "label": "Quels sont les trois principaux obstacles à l'articulation des AMP, des LMMA et de la PSM ?", "type": "checkbox", "required": true,
          "help": "3 réponses maximum.", "max": 3,
          "options": ["Mandats peu clairs", "Cadre juridique incomplet", "Coordination insuffisante", "Données manquantes", "Données non partagées",
            "Financement insuffisant", "Participation communautaire limitée", "Conflits d'usage", "Capacités techniques insuffisantes", "Autre"], "other": true,
          "detail": { "label": "Justification ou commentaire", "type": "textarea" } },
        { "id": "q028", "n": 28, "label": "Quels mécanismes devraient être prioritaires pour améliorer cette articulation ?", "type": "checkbox", "required": true,
          "help": "Plusieurs réponses possibles.",
          "options": ["Comité interinstitutionnel", "Harmonisation réglementaire", "Base de données géographiques partagée", "Intégration des plans de gestion dans la PSM",
            "Renforcement de la participation communautaire", "Financement commun", "Suivi-évaluation commun", "Autre"], "other": true },
        { "id": "q029", "n": 29, "label": "Parmi ces mécanismes, lequel devrait être prioritaire ?", "type": "radio", "required": true,
          "options": ["Comité interinstitutionnel", "Harmonisation réglementaire", "Base de données partagée", "Intégration des plans",
            "Participation communautaire", "Financement commun", "Suivi-évaluation", "Autre"], "other": true,
          "explain": "Pourquoi ce mécanisme devrait-il être prioritaire ?", "explainRequired": true },
        { "id": "q030", "n": 30, "label": "Quels indicateurs permettraient de mesurer les progrès de l'articulation AMP – LMMA – PSM ?", "type": "checkbox", "required": true,
          "help": "Privilégiez des indicateurs observables et vérifiables. Plusieurs réponses possibles.",
          "options": ["Fréquence des réunions communes", "Compatibilité des zonages", "Décisions conjointes", "Partage des données", "Participation des communautés", "Autre"], "other": true },
        { "id": "q031", "n": 31, "label": "Votre institution serait-elle disposée à participer à un mécanisme renforcé de coordination entre AMP, LMMA et PSM ?", "type": "radio", "required": true,
          "options": ["Oui", "Oui, sous certaines conditions", "Non", "Ne sait pas"],
          "detail": { "label": "Quelles conditions ?", "type": "textarea", "required": true, "showIf": { "eq": "Oui, sous certaines conditions" } } },
        { "id": "q032", "n": 32, "label": "Quelles sont les principales conditions à réunir pour assurer une meilleure articulation entre AMP, LMMA et PSM ?", "type": "textarea", "required": true,
          "help": "Réponse libre : votre synthèse personnelle." }
      ]
    }
  ]
};

if (typeof module !== "undefined") module.exports = SURVEY;
