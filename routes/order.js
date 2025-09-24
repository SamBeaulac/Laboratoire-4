/*
 * @file order.js
 * @author Samuel
 * @date 23/09/2025
 * @Brief Gestion du formulaire de commande et calcul du prix
 */

const express = require('express');
const router = express.Router();


// Prix d'un ingrédient supplémentaire
const extraPrice = 0.5;


// Prix de base pour chaque type de pizza (taille Medium)
const basePrices = {
    pepperoni: 8.00,
    margherita: 6.30,
    vegetarienne: 8.10,
    hawaienne: 7.00
};


// Multiplicateurs de prix selon la taille choisie
const sizeMultipliers = {
    Small: 0.8,
    Medium: 1.0,
    Large: 1.2,
    Extra_large: 1.4
};


// Génère un tableau de prix pour chaque taille à partir du prix de base
function generatePrices(basePrice) {
    let result = [];
    for (let mult in sizeMultipliers) {
        result.push(Number((basePrice * sizeMultipliers[mult]).toFixed(2)));
    }
    return result;
}


// Définition des pizzas disponibles dans le menu
const pizzas = {
    pepperoni: {
        key: "pepperoni",
        name: "Pepperoni Fromage",
        description: "Une pizza classique garnie de pepperoni épicé et de fromage fondant.",
        sizes: ["Small", "Medium", "Large"],
        price: generatePrices(basePrices.pepperoni),
        image: "/images/pepperoni-fromage.png"
    },
    margherita: {
        key: "margherita",
        name: "Margherita",
        description: "Une pizza traditionnelle italienne avec sauce tomate, mozzarella et basilic.",
        sizes: ["Small", "Medium", "Large"],
        price: generatePrices(basePrices.margherita),
        image: "/images/margherita.png"
    },
    vegetarienne: {
        key: "vegetarienne",
        name: "Végétarienne",
        description: "Poivrons, champignons, tomates et courgettes, idéale pour les amateurs de légumes.",
        sizes: ["Small", "Medium", "Large"],
        price: generatePrices(basePrices.vegetarienne),
        image: "/images/vegetarienne.png"
    },
    hawaienne: {
        key: "hawaienne",
        name: "Hawaïenne",
        description: "Mélange crémeux de mozzarella, cheddar, gorgonzola et parmesan sur pâte croustillante.",
        sizes: ["Small", "Medium", "Large"],
        price: generatePrices(basePrices.hawaienne),
        image: "/images/hawaienne.png"
    }
};


// --- ROUTES ---

// Route GET : Affiche le formulaire de commande
router.get('/', function (req, res) {
    let data = {};
    if (req.query.pizza) {
        data.pizza = req.query.pizza;
    }
    if (req.query.size) {
        data.size = req.query.size;
    }
    res.render('pages/order', { pizzas: pizzas, data: data, errors: [] });
});


// Pour stocker temporairement le résumé de la dernière commande
let lastResume = null;


// Route POST : Traitement du formulaire
router.post('/', function (req, res) {
    let data = req.body;
    let errors = [];

    // Quantité : doit être un entier entre 1 et 99
    let quantite = parseInt(data.quantite, 10);
    if (isNaN(quantite) || quantite < 1 || quantite > 99) {
        errors.push('La quantité doit être un entier entre 1 et 99.');
    }

    // Téléphone : doit respecter un format simple
    let telPattern = /^[0-9\-() ]+$/;
    if (!data.telephone || !telPattern.test(data.telephone)) {
        errors.push('Le numéro de téléphone est invalide.');
    }

    // Code postal : format canadien
    let postalPattern = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
    if (!data.postal_code || !postalPattern.test(data.postal_code)) {
        errors.push('Le code postal est invalide.');
    }

    // Courriel : doit être un email valide
    if (!data.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) {
        errors.push('Le courriel est invalide.');
    }

    // Nom et prénom obligatoires
    if (!data.nom || !data.prenom) {
        errors.push('Le nom et le prénom sont obligatoires.');
    }

    // Pizza : doit exister
    let pizzaKey = (data.pizza || '').replace('-fromage', '');
    if (!pizzas[pizzaKey]) {
        errors.push('Veuillez choisir une sorte de pizza.');
    }

    // Taille : doit exister
    let size = data.size;
    if (!sizeMultipliers[size]) {
        errors.push('Veuillez choisir une taille de pizza.');
    }

    // Si erreurs, réafficher
    if (errors.length > 0) {
        return res.render('pages/order', { pizzas: pizzas, data: data, errors: errors });
    }

    // --- CALCUL DU PRIX ---
    let basePrice = basePrices[pizzaKey];
    let sizeMultiplier = sizeMultipliers[size];

    // Extras
    let extras = [];
    if (Array.isArray(data['ingredients[]'])) {
        extras = data['ingredients[]'];
    } else if (data['ingredients[]']) {
        extras = [data['ingredients[]']];
    }
    let extrasCount = extras.length;

    // Prix
    let prixAvantTaxes = ((basePrice * sizeMultiplier) + (extrasCount * extraPrice)) * quantite;
    let prixApresTaxes = prixAvantTaxes * 1.14975;

    // --- RÉSUMÉ ---
    let resume = {
        pizza: pizzas[pizzaKey].name,
        taille: size,
        quantite: quantite,
        extras: extras,
        prixAvantTaxes: prixAvantTaxes.toFixed(2),
        prixApresTaxes: prixApresTaxes.toFixed(2),
        nom: data.nom,
        prenom: data.prenom,
        telephone: data.telephone,
        email: data.email,
        postal_code: data.postal_code,
        adresse: data.adresse,
        date: new Date().toLocaleString('fr-CA')
    };

    lastResume = resume;
    res.redirect('/order/sommaire');
});


// Route GET : Page sommaire
router.get('/sommaire', function (req, res) {
    if (!lastResume) {
        return res.render('pages/sommaire', { resume: null });
    }
    res.render('pages/sommaire', { resume: lastResume });
});


module.exports = router;
module.exports.pizzas = pizzas;
