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
        userId: req.body.user_id,
        posturl: file
    };
    try{
        // Controle de l'utilisateur
        if(req.body.user_id != req.auth.user_id){
            res.clearCookie('jwt');
            return res.status(401).json('Unauthorized.');
        }
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
            // Controle d'erreur et d'utilisateur
            if(error){
                return res.status(400).json(error);
            }else if(results[0].userId !== req.auth.user_id){
                res.clearCookie('jwt');
                return res.status(401).json("Unauthorized.")
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
    // Suppression du POST et des likes/commentaire lié
    // On joint tous les commentaireS et likes lié au post_id puis on les DELETE
    const deletePost = 'DELETE p, c, l FROM post p LEFT JOIN likes l ON p.post_id = l.post_id\
    LEFT JOIN comment c ON p.post_id = c.post_id WHERE p.post_id = ?';

    try{
        // Contrôle de l'existence du post dans la base de donnée
        connect.query(find, req.body.post_id, (error, results, fields) => {
            // Contrôl d'erreur et verification de l'utilisateur
            if(error){
                return res.status(400).json(error);
            }else if(results[0].userId !== req.auth.user_id){
                res.clearCookie('jwt');
                return res.status(401).json("Unauthorized.")
            }
            // Suprression de l'image du POST s'il y en a une , puis supression du POST
            fs.unlink(`./images/post_images/${results[0].posturl}`,() => {
                connect.query(deletePost, req.body.post_id, (error, results, fields) => {
                    if(error){
                        return res.status(400).json(error);
                    }
                    res.status(200).json("Suppression réussi.");
                })
            });
        });
    }catch(error){
        res.status(500).json(error);
    }
};
//*** Like/Dislike un POST ***//
//---------------------------//
exports.likes = (req, res, next) => {
    // Actions a effectuer dans la base de donnée
    const find = 'SELECT * FROM likes WHERE post_id = ? AND user_id = ?';
    const remove = 'DELETE FROM likes WHERE post_id = ? AND user_id = ?';
    const insert = 'INSERT INTO likes SET post_id = ?, user_id = ?';
    const options = [req.body.post_id, req.body.user_id];
    try{
        // Contrôle de la présence d'un like pour ce post ou non
        connect.query(find, options, (error, results, fields) => {
            if(error){
                return res.status(400).json(error);
            }
            // S'il n'y a pas de like
            if(!results[0]){
                connect.query(insert, options, (error, results, fields) => {
                    if(error){
                        return res.status(400).json(error);
                    }
                    res.status(200).json('Like effectué.');
                });
            //S'il y a un like
            }else{
                connect.query(remove, options, (error, results, fields) => {
                    if(error){
                        return res.status(400).json(error);
                    }
                    res.status(200).json('Dislike effectué.');
                });
            }
        })
    }catch(error){
        res.status(500).json(error);
    }
};
//*** Récupération de tout les POST / Le NB de LIKE par POST / Si l'utilisateur a LIKE ou non/ com ***//
//----------------------------------------------------------------------------------------------//
exports.getAllPost = (req, res, next) => {
    // Recuperation de tout les POST avec les noms utilisateur, leurs avatar
    // On y ajoute nbLikes qui fournit le nombre de likes grace a COUNT() de SQL
    // On y ajoute isLiked qui repond par 0 ou 1 pour savoir si l'utilisateur a liké, grace a COUNT() de SQL
    // On JOIN les infos utilisateur a leurs commentaire avec JOIN u.id = p.userId
    // On ordonne le resultat grâce a ma methode ORDER de SQL
    const findAll = "SELECT p.*, u.name, u.firstname, u.url,\
    (SELECT COUNT(*) FROM likes WHERE post_id = p.post_id) as nbLikes,\
    (SELECT COUNT(*) FROM likes WHERE post_id = p.post_id AND user_id = ?) as isLiked FROM post p\
    INNER JOIN user u ON u.id = p.userId\
    ORDER BY p.post_id DESC"

    try{
        connect.query(findAll, req.params.id, (error, results, fields) => {
            if(error){
                return res.status(400).json(error);
            }
            const post = results;
            const getAll = 'SELECT c.*, u.name, u.firstname, u.url FROM comment c INNER JOIN user u ON c.user_id = u.id ORDER BY c.date ASC';
            connect.query(getAll, (error, results, fields) => {
                if(error){
                    return res.status(400).json(error);
                }
                const com = results;
                res.status(200).json({post, com});
            })   
        })
    }catch(error){
        res.status(500).json(error);
    };
};