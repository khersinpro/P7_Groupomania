const {connect} = require('../DB.config/db.connexion');
const fs = require('fs');

// Création d'un post avec/sans image/commentaire
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
        // Controle du req.body avec l'id de l'utilisateur présent en BDD
        if(parseInt(req.body.user_id) !== req.auth.user_id){
            res.clearCookie('jwt');
            return res.status(401).json('Unauthorized.');
        }
        connect.query(sql, content, (error, results, fields) => {
            if(error) return res.status(400).json(error);
            
            res.status(201).json('Post crée avec succés.');
        })
    }catch(error){
        res.status(500).json(error);
    };
};

// Modification d'un POST 
exports.modifyPost = (req, res, next) => {
    // Action a effectuer dans la base de donnée
    const find = 'SELECT posturl, userId FROM post WHERE post_id = ?';
    // Fonction réutilisable
    const modifyPostData = (instruction, data) => {
        connect.query(instruction, data, (error, results, fields) => {
            if(error) return res.status(400).json(error);
            res.status(200).json("Modification réussi.");
        });
    }

    try{
        // Contrôle de l'existence du post dans la base de donnée
        connect.query(find, req.body.post_id, (error, results, fields) => {
            // Controle d'erreur et d'utilisateur
            if(error){
                return res.status(400).json(error);
            }else if(results[0].userId !== req.auth.user_id && req.auth.admin !== 1){
                res.clearCookie('jwt');
                return res.status(401).json("Unauthorized.")
            }
            
            // Suppression de l'ancienne image du post de L'API puis stockage des nouvelles infos
            if(req.file && req.body.message){
                const sql = 'UPDATE post SET message = ?, posturl = ? WHERE post_id = ?';
                const options = [req.body.message, req.file.filename, req.body.post_id];
                fs.unlink(`./images/post_images/${results[0].posturl}`, () => modifyPostData(sql, options)) 
            
            
            // Suppression de l'ancienne image du post de L'API puis stockage de la nouvelle image
            }else if(req.file && !req.body.message){
                const sql = 'UPDATE post SET posturl = ? WHERE post_id = ?';
                const options = [req.file.filename, req.body.post_id];
                fs.unlink(`./images/post_images/${results[0].posturl}`, () => modifyPostData(sql, options))
            
            // Modification du message du post dans la base de donnée
            }else if(!req.file && req.body.message){
                const sql = 'UPDATE post SET message = ? WHERE post_id = ?';
                const options = [req.body.message, req.body.post_id];
                modifyPostData(sql, options)
            
            }else{
                res.status(400).json({error: "Format de modification non conforme."})
            }
        })
    }catch(error){
        res.status(500).json(error);
    }   
};

// Suppression de l'image d'un post
exports.deletePostImage = (req, res, next) => {
    // Action a effectuer dans la base de donnée
    const find = 'SELECT posturl, userId FROM post WHERE post_id = ?';
    const deletePostImage = 'UPDATE post SET posturl = "" WHERE post_id = ?'
    
    try{
        // Contrôle de l'existence du post dans la base de donnée
        connect.query(find, req.body.post_id, (error, results, fields) => {
            // Contrôl d'erreur / présence du post / verification de l'utilisateur
            if(error){
                return res.status(400).json(error);
            }else if(!results[0]){
                return res.status(404).json("Aucun resultat.")
            }else if(results[0].userId !== req.auth.user_id && req.auth.admin !== 1){
                res.clearCookie('jwt');
                return res.status(401).json("Unauthorized.")
            }
            // Suprression de l'image du POST s'il y en a une , puis supression du POST
            fs.unlink(`./images/post_images/${results[0].posturl}`,() => {
                connect.query(deletePostImage, req.body.post_id, (error, results, fields) => {
                    if(error) return res.status(400).json(error);
                    
                    res.status(200).json("Suppression réussi.");
                })
            });
        });
    }catch(error){
        res.status(500).json(error);
    }
}

// Suppression d'un POST
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
            // Contrôl d'erreur / présence du post / verification de l'utilisateur
            if(error){
                return res.status(400).json(error);
            }else if(!results[0]){
                return res.status(404).json("Aucun resultat.")
            }else if(results[0].userId !== req.auth.user_id && req.auth.admin !== 1){
                res.clearCookie('jwt');
                return res.status(401).json("Unauthorized.")
            }
            
            // Suprression de l'image du POST s'il y en a une , puis supression du POST
            fs.unlink(`./images/post_images/${results[0].posturl}`,() => {
                connect.query(deletePost, req.body.post_id, (error, results, fields) => {
                    if(error) return res.status(400).json(error);
                    res.status(200).json("Suppression réussi.");
                })
            });
        });
    }catch(error){
        res.status(500).json(error);
    }
};

// Like/Dislike un POST 
exports.likes = (req, res, next) => {
    // Actions a effectuer dans la base de donnée
    const find = 'SELECT * FROM likes WHERE post_id = ? AND user_id = ?';
    const remove = 'DELETE FROM likes WHERE post_id = ? AND user_id = ?';
    const insert = 'INSERT INTO likes SET post_id = ?, user_id = ?';
    const options = [req.body.post_id, req.body.user_id];
    // Fonction réutilisable
    const likeOrDislike = (instruction, data, message) => {
        connect.query(instruction, data, (error, results, fields) => {
            if(error){
                return res.status(400).json(error);
            }
            res.status(200).json(message);
        });
    }
    try{
        // Controle des id utilisateurs
        if(req.body.user_id !== req.auth.user_id){
            res.clearCookie("jwt")
            return res.status(401).json('Unauthorired')
        }
        // Contrôle de la présence d'un like pour ce post ou non
        connect.query(find, options, (error, results, fields) => {
            if(error) return res.status(400).json(error);
            
            // S'il n'y a pas de like
            if(!results[0]){
                likeOrDislike(insert, options, 'Like effectué.');
            }else{
                likeOrDislike(remove, options, 'Dislike effectué.' )
            }
        })
    }catch(error){
        res.status(500).json(error);
    }
};

// Récupération de tout les POST / Le NB de LIKE par POST / Le NB de COM par POST 
exports.getAllPost = (req, res, next) => {
    // Recuperation de tout les POST avec les noms utilisateur, leurs avatar
    // On y ajoute nbLikes qui fournit le nombre de likes grace a COUNT() de SQL
    // On y ajoute isLiked qui repond par 0 ou 1 pour savoir si l'utilisateur a liké, grace a COUNT() de SQL
    // On JOIN le nombre de commentaire par post au nom de nbComs
    // On ordonne le resultat grâce a ma methode ORDER de SQL
    const findAll = "SELECT post.*, user.name, user.firstname, user.url,\
    (SELECT COUNT(*) FROM likes WHERE post_id = post.post_id) as nbLikes,\
    (SELECT COUNT(*) FROM likes WHERE post_id = post.post_id AND user_id = ?) as isLiked,\
    (SELECT COUNT(*) FROM comment WHERE post_id = post.post_id ) as nbComs FROM post \
    INNER JOIN user ON user.id = post.userId ORDER BY post.post_id DESC"
    
    try{
        connect.query(findAll, req.params.id, (error, results, fields) => {
            if(error){
                return res.status(400).json(error);
            }else if(!results[0]){
                return res.status(404).json("Aucun resultats.")
            }
            res.status(200).json(results)
        })
    }catch(error){
        res.status(500).json(error);
    };
};

// Récupération de tout les Likes d'un POST 
exports.getPostLikes = (req, res, next) => {
    // Actions a effectuer dans la base de donnée
    const find = 'SELECT COUNT(*) as likes, (SELECT COUNT(*) FROM likes WHERE post_id = ? AND user_id = ?) as isLiked FROM likes WHERE post_id = ?';
    const options = [req.params.id, req.auth.user_id, req.params.id];

    try{
        connect.query(find, options , (error, results, next) => {
            if(error){
                return res.status(400).json(error);
            }else if(!results[0]){
                res.status(404).json("Aucun resultats.")
            }
            res.status(200).json(results[0])
        })
    }catch(error){
        res.status(500).json(error)
    }
}