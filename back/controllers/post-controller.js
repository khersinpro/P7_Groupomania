const {connect} = require('../DB.config/db.connexion');
const fs = require('fs');
const { connexion } = require('./user-controller');

//*** Création d'un post avec/sans image/commentaire ***//
//-----------------------------------------------------//
exports.createPost = (req, res, next) => {
    // Action a effectuer dans la base de donnée
    const sql = 'INSERT INTO post SET ?';
    // Retourne le nom du fichier s'il y en a un , sinon ""
    const file = req.file ? req.file.filename : '';
    // Retourne le message s'il y en a un, sinon ""
    const message = req.body.message ? req.body.message : "";
    // Le contenu du post a enregistrer dans la base de donnée 
    const content = {
        message,
        date: req.body.date,
        userId: req.body.userId,
        posturl: file
    };
    try{
        connect.query(sql, content, (error, results, fields) => {
            if(error){
                return res.status(400).json(error);
            }
            res.status(201).json('Post crée avec succés.');
        })
    }catch(error){
        res.status(500).json(error);
    };
};
//*** Modification d'un POST ***//
//-----------------------------//
exports.modifyPost = (req, res, next) => {
    // Action a effectuer dans la base de donnée
    const find = 'SELECT posturl, userId FROM post WHERE post_id = ?';
    try{
        // Contrôle de l'existence du post dans la base de donnée
        connect.query(find, req.body.post_id, (error, results, fields) => {
            if(error){
                return res.status(400).json(error);
            }
            // S'il y a un fichier et un message
            if(req.file && req.body.message){
                const sql = 'UPDATE post SET message = ?, posturl = ? WHERE post_id = ?';
                const options = [req.body.message, req.file.filename, req.body.post_id];
                // Suppression de l'ancienne image du post de L'API puis stockage des nouvelles infos
                fs.unlink(`./images/post_images/${results[0].posturl}`, () => {
                    connect.query(sql, options, (error, results, fields) => {
                        if(error){
                            return res.status(400).json(error);
                        }
                        res.status(200).json("Modification réussi.");
                    });
                })
            // S'il y a uniquement un fichier
            }else if(req.file && !req.body.message){
                const sql = 'UPDATE post SET posturl = ? WHERE post_id = ?';
                const options = [req.file.filename, req.body.post_id];
                // Suppression de l'ancienne image du post de L'API puis stockage de la nouvelle image
                fs.unlink(`./images/post_images/${results[0].posturl}`, () => {
                    connect.query(sql, options, (error, results, fields) => {
                        if(error){
                            return res.status(400).json(error);
                        }
                        res.status(200).json("Modification réussi.");
                    });
                })
            // S'il y a uniquement un message
            }else if(!req.file && req.body.message){
                const sql = 'UPDATE post SET message = ? WHERE post_id = ?';
                const options = [req.body.message, req.body.post_id];
                // Modification du message du post dans la base de donnée
                connect.query(sql, options, (error, results, fields) => {
                    if(error){
                        return res.status(400).json(error);
                    }
                    res.status(200).json("Modification réussi.");
                });
            }
        })
    }catch(error){
        res.status(500).json(error);
    }   
};
//*** Suppression d'un POST ***//
//----------------------------//
exports.deletePost = (req, res, next) => {
    // Action a effectuer dans la base de donnée
    const find = 'SELECT posturl, userId FROM post WHERE post_id = ?';
    const deletePost = 'DELETE FROM post WHERE post_id = ?';
    try{
        // Contrôle de l'existence du post dans la base de donnée
        connect.query(find, req.body.post_id, (error, results, fields) => {
            // Contrôl d'erreur et verification de l'utilisateur
            if(error){
                return res.status(400).json(error);
            }else if(results[0].userId !== req.body.user_id){
                console.log(results[0].userId);
                return res.status(401).json("Unauthorized.")
            }
            // Suprression de l'image du POST s'il y en a une , puis supression du POST
            fs.unlink(`./images/post_images/${results[0].posturl}`,() => {
                connect.query(deletePost, req.body.post_id, (error, results, fields) => {
                    if(error){
                        res.status(400).json(error);
                    }
                    res.status(200).json("Suppression réussi.");
                })
            });
        });
    }catch(error){
        res.status(500).json(error);
    }
};