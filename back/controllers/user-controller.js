const {connect} = require('../DB.config/db.connexion');
const bcrypt = require('bcrypt');

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
                res.status(200).json("Connexion réussi.")  ;      
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
            };
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
//*** Recuperation des infos d'un utilisateur ***/
exports.getOneUser = (req, res, next) => {
    // Actions a effectuer dans la base de donnée
    const findUser = "SELECT name, firstname FROM user WHERE id = ?";
    try{
        connect.query(findUser, req.params.id, (error, results, fields) => {
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