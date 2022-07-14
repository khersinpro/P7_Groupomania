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
                console.log(req.body);
                return res.status(400).json(error)
            }
            res.status(201).json({message: 'Votre compte à été crée avec succés.'})
        });
    })
    .catch(error => {
        res.status(500).json(new Error("Une erreur est survenue, veuillez réessayer plus tard."))
    });
};
//*** Connexion d'un utilisateur ***/