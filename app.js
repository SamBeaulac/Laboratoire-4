/*
 * @file app.js
 * @author Samuel Beaulac
 * @date 21-09-2025
 * @Brief 
 * @details 
*/

const express = require('express');
const app = express();
const port = 8080;

// Moteur template EJS
app.set('view engine', 'ejs');
// Dossier des fichiers vues
app.set('views', __dirname + '/views');
// Dossier des fichiers statiques
app.use(express.static(__dirname + '/public'));


// Routes

// Index
app.get('/', function(req, res) {
    res.render('pages/index');
});

// 404
app.use(function(req, res, next) {
    res.status(404).render('pages/404');
});

// Démarrage du serveur
app.listen(port);
