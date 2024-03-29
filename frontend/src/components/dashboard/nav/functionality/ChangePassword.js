import React, {useState, useContext} from 'react'
import { userContext } from '../../../context/UserContext'
import { toast } from 'react-toastify';

const ChangePassword = ({close}) => {
    // State de recupération du mot de passe actuel
    const [actualPassword, setActualPassword] = useState("")
    // State de recupération du nouveau mot de passe
    const [newPassword, setNewPassword] = useState("")
    // Récupération du context utilisateur
    const { user, instance } = useContext(userContext);
    //*** Minimum 12 characters, at least one uppercase letter, one lowercase letter, one number and one special character ***/
    const passwordReg = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-+])(?=\\S+$).{12,}$";

    // Fonction d'envoi du mot de passe
    const sendNewPassword = (e) => {
        e.preventDefault()
        // Control avant l'envoi
        if(actualPassword.match(passwordReg) && newPassword.match(passwordReg)){
            instance.put("/api/user/modifypassword", {user_id: user.id, password:actualPassword, newPassword })
            .then(() => toast.success("Mot de passe modifié !", {autoClose: 2000}))
            .catch(error => toast.error(error.response.data + " Veuillez réessayer.", {autoClose: 2000}))
            close(false)
        }else{
            toast.error("Veuillez entrer des mots de passes valide ...", {autoClose: 2000} )
        }
    }

    return (
        <div className='modifyPassword'>
            <form aria-label='Formulaire de modification de mot de passe' className='modifyPassword--form box-style' onSubmit={sendNewPassword} >
                <h3>Modification de mot de passe</h3>
                <hr className='hrLarge' role="separator"></hr>

                <label htmlFor='actualPassword'>Mot de passe actuel :</label>
                <input placeholder='Mot de passe actuel' onChange={e => setActualPassword(e.target.value)} id='actualPassword' type='password' aria-required="true" tabIndex="7" />
                { // Affichage d'erreur si le mot de passe ne match pas avec la regex
                    actualPassword.length > 1 && !actualPassword.match(passwordReg) &&
                    <p className='modifyPassword--form__err'>
                        <i className="fa-solid fa-triangle-exclamation"></i>
                        Mot de passe incorrect
                    </p>
                }

                <label htmlFor='NewPassword'>Nouveau mot de passe :</label>
                <input placeholder='Nouveau mot de passe' onChange={e => setNewPassword(e.target.value)} id='newPassword' type='password' aria-required="true" tabIndex="8"/>
                { // Affichage d'erreur si le mot de passe ne match pas avec la regex
                    newPassword.length > 1 && !newPassword.match(passwordReg) &&
                    <p className='modifyPassword--form__err'>
                        <i className="fa-solid fa-triangle-exclamation"></i>
                        Mot de passe incorrect
                    </p>
                }

                <div className='modifyAvatar--form__subBtn passSub'>
                    <button className='button-style' type="submit" tabIndex="9">Envoyer</button>
                    <button className='button-style' type='button' tabIndex="10" onBlur={() => close(false)}  onClick={() => close(false)}>Annuler</button>
                </div>
            </form>
        </div>
    )
}

export default ChangePassword