const { body, validationResult } = require('express-validator');
//*** numeric and letter _ . - + numeric and letters min 2 max 10 + letters min 2 max 5 ***/
const emailReg = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
//*** Minimum 12 characters, at least one uppercase letter, one lowercase letter, one number and one special character ***/
const passwordReg = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-+])(?=\\S+$).{12,}$";
//***Doit contenir 1 lettre mini, peut contenir -/ /' ***/
const nameReg = "^[a-zA-Zéèàîïùâ]+(([' -][a-zA-Z])?[a-zA-Zéèàîïùâ]*)*$";

// Controle des entrées pour la création d'utilisateur
exports.signupControl = (req, res, next) => {
    const {name, firstname, email, password} = req.body;
    if(!name.match(nameReg) || !firstname.match(nameReg)){
        res.status(400).json({error: "Format du nom ou du prénom incorrect."})
    }else if(!email.match(emailReg)){
        res.status(400).json({error: "Format d'email incorrect"})
    }else if(!password.match(passwordReg)){
        res.status(400).json({error: "Format de mot de passe incorrect"})
    }else{
        next()
    }
}

// Controle des entrées pour la connexion d'utilisateur
exports.loginControl = (req, res, next) => {
    const {email, password} = req.body;

    if(!email.match(emailReg)){
        res.status(400).json({error: "Format d'email incorrect"})
    }else if(!password.match(passwordReg)){
        res.status(400).json({error: "Format de mot de passe incorrect"})
    }else{
        next()
    }
}

// Controle des entrées pour le changement de mot de passe
exports.modifyPasswordControl = (req, res, next) => {
    const {password, newPassword} = req.body;

    if(!password || !password.match(passwordReg)){
        res.status(400).json({error: "Format du mot de passe incorrect"})
    }else if(!newPassword || !newPassword.match(passwordReg)){
        res.status(400).json({error: "Format du nouveau mot de passe incorrect"})
    }else{
        next()
    }
}

// Controle des entrées pour la création/modif des post 
// Permet d'eviter tout types d'injections et de formulaire mal remplis
exports.sanitizationPost =  [
    body('user_id').isNumeric().withMessage("ID incorrect"),
    body('message').optional().not().isEmpty().trim().blacklist(`<>"/&`).withMessage("Le message est vide"), 
    body('message').optional().not().isEmpty().trim().withMessage("Le message est vide ou contient de mauvais caractéres"),
    (req, res, next) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }
        next()
    }
]

// Protection des com contre les injections
exports.sanitizationCom =  [
    body('user_id').isNumeric().withMessage("ID incorrect"),
    body('post_id').isNumeric().withMessage("l'id du post est incorrect"),
    body('comment').not().isEmpty().trim().blacklist(`<>"/&`).withMessage("Le message est vide"), 
    body('comment').not().isEmpty().trim().withMessage("Le message est vide ou contient de mauvais caractéres"),
    (req, res, next) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }
        next()
    }
]

