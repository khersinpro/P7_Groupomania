import React, {useState, useContext} from 'react'
import { userContext } from '../../../context/UserContext'
import axios from 'axios'

const ChangePassword = ({close}) => {
    // State de recupération du mot de passe actuel
    const [actualPassword, setActualPassword] = useState("")
    // State de recupération du nouveau mot de passe
    const [newPassword, setNewPassword] = useState("")
    // Récupération du context utilisateur
    const { user } = useContext(userContext);
    // Instance d'axios pour ajouter les credentials et la base de l'URL automatiquement 
    const instance = axios.create( {withCredentials: true, baseURL: "http://localhost:3000" } );

    // Fonction de controle du mot de passe
    // A ajouter a la fin
    
    // Fonction d'envoi du mot de passe


    return (
        <div className='modifyPassword'>
            <form className='modifyPassword--form                       '>
                <h3>Modification de mot de passe</h3>
                <hr className='post--hrLarge'></hr>

                <label htmlFor='actualPassword'>Mot de passe actuel :</label>
                <input id='actualPassword' type='password' />

                <label htmlFor='NewPassword'>Nouveau mot de passe :</label>
                <input id='newPassword' type='password' />

                <div className='modifyAvatar--form__subBtn'>
                    <input type="submit" />
                    <button onClick={() => close(false)}>Annuler</button>
                </div>
            </form>
        </div>
    )
}

export default ChangePassword