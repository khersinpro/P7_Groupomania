import React, {useState, useContext} from 'react'
import { userContext } from '../../../context/UserContext'
import { toast } from 'react-toastify';
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
    const sendNewPassword = (e) => {
        e.preventDefault()
        instance.put("/api/user/modifypassword", {user_id: user.id, password:actualPassword, newPassword })
        .then(() => toast.success("Mot de passe modifié !", {autoClose: 2000}))
        .catch(error => toast.error(error.response.data + " Veuillez réessayer.", {autoClose: 2000}))
        close(false)
    }

    return (
        <div className='modifyPassword'>
            <form className='modifyPassword--form' onSubmit={sendNewPassword} >
                <h3>Modification de mot de passe</h3>
                <hr className='post--hrLarge'></hr>

                <label htmlFor='actualPassword'>Mot de passe actuel :</label>
                <input onChange={e => setActualPassword(e.target.value)} id='actualPassword' type='password' />

                <label htmlFor='NewPassword'>Nouveau mot de passe :</label>
                <input onChange={e => setNewPassword(e.target.value)} id='newPassword' type='password' />

                <div className='modifyAvatar--form__subBtn'>
                    <input type="submit" />
                    <button onClick={() => close(false)}>Annuler</button>
                </div>

            </form>
        </div>
    )
}

export default ChangePassword