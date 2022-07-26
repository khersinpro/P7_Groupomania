const rateLimit = require('express-rate-limit');

// Permet de gerer les attaques par force brute a la connexion
exports.connexionLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 50, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    message: 'Trop de tentatives de connexion entrante avec cette adresse IP, veuillez ressayer plus tard.'
});

// Limiter les spam de création de compte
exports.createAccountLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour
	max: 5, // Limit each IP to 5 create account requests per `window` (here, per hour)
	message:'Too many accounts created from this IP, please try again after an hour'
})