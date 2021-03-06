const {connect} = require('../DB.config/db.connexion');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const fs = require('fs');

// Création d'un utilisateur 
exports.createUser = (req, res, next) => {
    // Action a effectuer dans la base de donnée
    const sql = "INSERT INTO user SET ?";
    const {name, firstname, email} = req.body;

    try{
        // Hachage du mot de passe avant ajout dans la base de donnée
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
    }catch(error){
        res.status(500).json(error)
    }
};

// Connexion d'un utilisateur
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
                if(!valid) return res.status(401).json("Mot de passe incorrect.");
                
                // Création du token avec expiration dans 24h
                const token = jwt.sign({user_id: results[0].id}, process.env.JWT_KEY,{expiresIn: '24h'});
                
                // secure: true for htpps, samesite for crsf attack, expires
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

//*** Déconnexion ***//
exports.logout = (req, res, next) => {
    try{
        res.clearCookie("jwt");
        res.status(200).json("Deconnexion réussi !")
    }catch(error){
        res.status(500).json(error)
    }
}

//*** Recuperation des infos de l'utilisateur connecté ***/
exports.getUser = (req, res, next) => {
    // Actions a effectuer dans la base de donnée
    const findUser = "SELECT id, name, firstname, isAdmin, url FROM user WHERE id = ?";

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

//*** Ajout ou modification de l'image de profil ***//
exports.modifyAvatar = (req, res, next) => {
    // Actions a effectuer dans la base de donnée
    const control = 'SELECT url FROM user WHERE id = ?';
    const modifiy = 'UPDATE user SET url = ? WHERE id = ?';

    // Fonction re utilisable
    const avatarChange = () => {
        connect.query(modifiy, [req.file.filename, req.body.user_id], (error, results, next) => {
            if(error) return res.status(400).json(error);
            res.status(200).json("Modification réussi.")
        })
    }      
    try{
        // Controle de l'utilisateur
        connect.query(control, req.body.user_id, (error, results, fields) => {
            // Si il y a une erreur, Si il y a aucun resultats
            if(error){
                return res.status(400).json(error)
            }else if(!results[0]){
                return res.status(404).json({error: "Aucun resultat."}) 
            }
            // Si l'utilisateur a la photo de profil par default 
            if(results[0].url === "User-avatar.webp") return avatarChange()
            // Si l'utilisateur n'a pas la photo de profil par default 
            fs.unlink('./images/user_avatar/' + results[0].url, () => avatarChange())
        })
    }catch(error){
        res.status(500).json(error);
    }
}

//*** Modifier le mot de passe ***/
exports.modifiyPassword = (req, res, next) => {
    const find = "SELECT password FROM user WHERE id = ?"
    const changePassword = "UPDATE user SET password = ? WHERE id = ?"

    try{
        // Controle id utilisateur
        if(req.auth.user_id !== req.body.user_id){
            res.clearCookie('jwt')
            res.status(401).json('Unauthorized')
        }
        // Controle presence utilisateur et récupération du mot de passe
        connect.query(find, req.auth.user_id, (error, results, fields) => {
            if(error){
                return res.status(400).json(error)
            }else if(!results[0]){
                return res.status(404).json("Aucun resultats.")
            }

            // Comparaison des mot de passe
            bcrypt.compare(req.body.password, results[0].password)
            .then( valid => {
                if(!valid) return res.status(401).json("Mot de passe incorrect.");
                
                // hachage du nouveau mot de passe et insertion en base de donnée
                bcrypt.hash(req.body.newPassword, 10)
                .then(hash => {
                    connect.query(changePassword, [hash, req.body.user_id], (error, results, next) => {
                        if(error) return res.status(400).json(error);
                            
                        res.status(200).json("Mot de passe modifié.")
                    })
                })
                .catch(error => res.status(500).json(error))
            })
            .catch(error => res.status(500).json(error))
        })
    }catch(error){
        res.status(500).json(error)
    }
}