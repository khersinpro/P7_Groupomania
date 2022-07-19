const {connect} = require('../DB.config/db.connexion');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
//*** Création d'un utilisateur ***/
exports.createUser = (req, res, next) => {
    // Action a effectuer dans la base de donnée
    const sql = "INSERT INTO user SET ?";
    const {name, firstname, email} = req.body;
    // Hachage du mot de passe acant ajout dans la base de donnée
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const userData = {name, firstname, email, password: hash} ;
        // Connexion a la base de donnée, puis insertion des données utilsiateur grâce a sql et userData
        connect.query(sql, userData, (error, results, fields) => {
            if(error){ 
                return res.status(400).json(error)
            }
            res.status(201).json('Votre compte à été crée avec succés.')
        });
    })
    .catch(error => {
        res.status(500).json("Une erreur est survenue, veuillez réessayer plus tard.")
    });
};
//*** Connexion d'un utilisateur ***/
exports.connexion = (req, res, next) => {
    // Action a effectuer dans la base de donnée
    const sql = "SELECT id, password FROM user WHERE email = ?";
    try{
        connect.query(sql, req.body.email, (error, results, fields) => {
            // Si il y a une erreur ou aucun resultats
            if(error){
                return res.status(400).json(error);
            }else if(!results[0]){
                return res.status(404).json('E-mail ou mot de passe incorrect.');
            };
            // Comparaison des mot de passe
            bcrypt.compare(req.body.password, results[0].password)
            .then(valid => {
                // Si le mot de passe est faux
                if(!valid){
                    return res.status(401).json("Mot de passe incorrect.");
                };
                const exprires = '24h';
                const token = jwt.sign({user_id: results[0].id}, process.env.JWT_KEY,{expiresIn: exprires});
                //secure: true for htpps, samesite for crsf attack, expires
                res.cookie("jwt", token, {httpOnly: true});
                res.status(200).json({user_id : results[0].id});      
            })
            .catch(error => {
                res.status(400).json("Une erreur est survenue, veuillez réessayer plus tard.");
            });
        });
    }catch(error){
        res.status(500).json(error);
    };
};
//*** Supprression d'un utilisateur ***/
exports.deleteUser = (req, res, next) => {
    // Actions a effectuer dans la base de donnée
    const findUser = "SELECT * FROM user WHERE email = ?";
    const deleteUser = "DELETE FROM user WHERE id = ?";
    try{
        // Si les ID ne sont pas identiques
        if(req.body.user_id != req.auth.user_id){
            res.clearCookie('jwt');
            return res.status(401).json('Unauthorized.')
        }
        // Si les mot de passe ne sont pas identiques
        if(req.body.password !== req.body.passwordConf){
            return res.status(401).json('Les mot de passe ne sont pas identiques.');
        };
        // Recherche de l'existance de l'utilisateur
        connect.query(findUser, req.body.email, (error, results, fields) => {
            // Si il y a une erreur ou aucun resultats
            if(error){
                return res.status(400).json(error);
            }else if(!results[0]){
                return res.status(404).json('E-mail ou mot de passe incorrect.');
            }
            // Comparaison des mot de passe
            bcrypt.compare(req.body.password, results[0].password)
            .then(valid => {
                // Si le mot de passe est incorrect
                if(!valid){
                    return res.status(401).json('Mot de passe incorrect.');
                };
                // Suppression de l'utilisateur
                connect.query(deleteUser, results[0].id, (error, results, fields) => {
                    if(error){
                        return res.status(400).json(error);
                    };
                    res.status(200).json('Suppression réussi.');
                });
            })
            .catch(error => {
                res.status(400).json(error);
            });
        });
    }catch(error){
        res.status(500).json(error);
    };
};
//*** Recuperation des infos de l'utilisateur connecté ***/
exports.getUser = (req, res, next) => {
    // Actions a effectuer dans la base de donnée
    const findUser = "SELECT id, name, firstname, isAdmin FROM user WHERE id = ?";
    try{
        connect.query(findUser, req.auth.user_id, (error, results, fields) => {
            // Si il y a une erreur ou aucun resultats
            if(error){
                return res.status(400).json(error);
            }else if(!results[0]){
                return res.status(404).json('Utilisateur inconnu.');
            };
            res.status(200).json(results);
        })
    }catch(error){
        res.status(500).json(error);
    };
};