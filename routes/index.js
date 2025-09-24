/*
 * @file index.js
 * @author Samuel Beaulac
 * @date 23/09/2025
 * @Brief Route pour la page d'accueil
*/

const express = require('express');
const router = express.Router();

const { pizzas } = require('./order');

router.get('/', (req, res) => {
    res.render('pages/index', { pizzas });
});

module.exports = router;