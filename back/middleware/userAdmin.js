const {connect} = require('../DB.config/db.connexion')

module.exports = (req, res, next) => {
    // Controle du req.body avec l'id de l'utilisateur présent en BDD
    if(parseInt(req.body.user_id) !== req.auth.user_id){
        res.clearCookie('jwt');
        return res.status(401).json('Unauthorized.');
    }

    // Controle si l'utilisateur est admin ou non
    try{
        const verify = 'SELECT isAdmin FROM user WHERE id = ?';
        connect.query(verify, req.auth.user_id, (error, results, fields) => {
            // Si il y a une erreur ou aucun resultats
            if(error){
                return res.status(400).json(error);
            }else if(!results[0]){
                res.clearCookie('jwt');
                return res.status(401).json('Unauthorized.');
            }
            
            // Ajout des données utilisateur / admin dans le req.auth
            req.auth = {...req.auth, admin: results[0].isAdmin};
            next()
        })
    }catch(error){
        res.status(500).json(error)
    }
}