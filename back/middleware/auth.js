const jwt = require('jsonwebtoken');
const {connect} = require('../DB.config/db.connexion');
require('dotenv').config();

// Sécurisation des routes
exports.auth = (req, res, next) => {
    try{
        // Controle de la presence du cookie cotenant le JWT
        if(!req.cookies.jwt) return res.status(401).json({error: 'Unauthorized'});
        
        // Decryptage du JWT
        const decodedToken = jwt.verify(req.cookies.jwt, process.env.JWT_KEY);

        // Controle de la presence de l'utilisateur et si il est admin en BDD
        const verify = 'SELECT id FROM user WHERE id = ?';
        connect.query(verify, decodedToken.user_id, (error, results, fields) => {
            // Si il y a une erreur ou aucun resultats
            if(error){
                return res.status(400).json(error);
            }else if(!results[0]){
                res.clearCookie('jwt');
                return res.status(401).json('Unauthorized.');
            }
            // Ajout des données utilisateur dans le req.auth
            req.auth = {user_id: results[0].id};
            next()
        })
    }catch(error){
        res.clearCookie('jwt');
        res.status(500).json(error);
    }
};

// Controleur pour savoir si un cookie de session est présent au lancement du FRONTEND
exports.sessionControl = (req, res, next) => {
    try{
        // Controle de la presence du cookie cotenant le JWT
        if(!req.cookies.jwt) return res.status(200).json({user_id: ""});
    
        // Decryptage du JWT
        const decodedToken = jwt.verify(req.cookies.jwt, process.env.JWT_KEY);

        if(decodedToken){
            res.status(200).json({user_id: decodedToken.user_id})
        }else{
            res.status(400).json({error: "Une erreur est survenue, veuillez vous connecter"})
        }
    }catch(error){
        res.status(500).json(error)
    }
}