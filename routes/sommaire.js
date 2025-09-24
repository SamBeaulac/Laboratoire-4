
/*
 * @file sommaire.js
 * @author Samuel
 * @date 23/09/2025
 * @Brief Gestion du formulaire de commande et calcul du prix
 */

const express = require('express');
const router = express.Router();

// Affiche la page sommaire (le résumé doit être passé via la session ou un paramètre)
router.get('/', (req, res) => {
    // À adapter selon la logique de session ou de passage de données
    res.render('pages/sommaire', { resume: null });
});

module.exports = router;
