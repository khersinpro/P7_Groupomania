const {connect} = require('../DB.config/db.connexion');
const { connexion } = require('./user-controller');

//*** Création d'un commentaire ***//
//--------------------------------//
exports.createCom = (req, res, next) => {
    const create = 'INSERT INTO comment SET ?';
    const {post_id, comment, date, user_id} = req.body;
    const options = {post_id, comment, date, user_id};
    try{
        connect.query(create, options, (error, results, fields) => {
            if(error){
                return res.status(400).json(error);
            }
            res.status(201).json("Commentaire crée.");
        })
    }catch(error){
        res.status(500).json(error);
    };
};
//*** Suppression d'un commentaire ***//
//-----------------------------------//
exports.deleteCom = (req, res, next) => {
    const find = 'SELECT * FROM comment WHERE id = ?';
    const remove = 'DELETE FROM comment WHERE id = ?';

    try{
        // Verification de la présence du commentaire
        connect.query(find, req.body.id, (error, results, fields) => {
            // Controle d'erreur et d'authentification avec l'user_id
            if(error){
                return res.status(400).json(error);
            }else if(results[0].user_id !== req.body.user_id){
                return res.status(401).json('Unauthorized.');
            }
            // Suppression du commentaire
            connect.query(remove, req.body.id, (error, results, fields) => {
                if(error){
                    return res.status(400).json(error);
                }
                res.status(200).json("Commentaire supprimé.");
            });
        });
    }catch(error){
        res.status(500).json(error);
    };
};