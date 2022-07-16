const {connect} = require('../DB.config/db.connexion');
const fs = require('fs');

//*** Création d'un post avec/sans image/commentaire ***/
exports.createPost = (req, res, next) => {
    console.log(req.body);
    const sql = 'INSERT INTO post SET ?';
    const file = req.file ? req.file.filename : '';
    const message = req.body.message ? req.body.message : "";
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
            res.status(201).json('Post crée avec succés!');
        })
    }catch(error){
        res.status(500).json(error);
    };
};