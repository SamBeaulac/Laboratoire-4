/*
 * @file app.js
 * @author Samuel Beaulac
 * @date 23-09-2025
 * @Brief Point d'entrée de l'application
*/

// Import des modules nécessaires
const express = require('express');
// Initialisation de l'application Express
const app = express();

// Port d'écoute du serveur
const port = 8080;

// Moteur template EJS
app.set('view engine', 'ejs');
// Dossier des fichiers vues
app.set('views', __dirname + '/views');
// Dossier des fichiers statiques
app.use(express.static(__dirname + '/public'));
// Middleware pour parser le corps des requêtes
app.use(express.json());
// Middleware pour parser les données des formulaires
app.use(express.urlencoded({extended: false}));

// Routes
// Index
app.use('/',require('./routes/index'));
// Commande
app.use('/order', require('./routes/order'));
// Sommaire
app.use('/sommaire', require('./routes/sommaire'));
// 404
app.use(function(req, res, next) {
    res.status(404).render('pages/404');
});

// Démarrage du serveur
app.listen(port);
