const {connect} = require('../DB.config/db.connexion');

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
//*** Récupération de tous les commentaires ***//
//--------------------------------------------//
exports.getAllComs = (req, res, next) => {
    // Récupère tous les coms avec un inner join pour ajouter le nom et le prénom de l'utilisateur en liaison avec leur id
    const getAll = 'SELECT c.*, u.name, u.firstname FROM comment c INNER JOIN user u ON c.user_id = u.id ORDER BY c.date ASC';
    try{
        connect.query(getAll, (error, results, fields) => {
            if(error){
                return res.status(400).json(error);
            }
            res.status(200).json(results);
        })
    }catch(error){
        res.status(500).json(error);
    }
};