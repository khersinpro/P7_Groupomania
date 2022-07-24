import React, {useState, useContext} from 'react'
import { userContext } from '../../../context/UserContext'
import { toast } from 'react-toastify';
import axios from 'axios'

const ChangeAvatar = ({close}) => {
    // State pour stocker l'avatar de l'utilisateur
    const [avatar, setAvatar] = useState();
    // State d'affichage d'erreur
    const [avatarEmpty, setAvatarEmpty] = useState(false)
    // Import des données du userContext
    const {user, refresh, setRefresh} = useContext(userContext);
    // Instance d'axios pour ajouter les credentials et la base de l'URL automatiquement 
    const instance = axios.create( {withCredentials: true, baseURL: "http://localhost:3000" } );

    // Fonction de changement d'avatar
    const changeAvatar = (e) => {
        e.preventDefault();
        if(avatar){
            const data = new FormData();
            data.append("image", avatar);
            data.append('user_id', user.id)

            // Envoie du formulaire a l'API
            instance.post("/api/user/changeavatar", data )
            .then(() => {
                setRefresh(!refresh)
                toast.success('Changement réussi !', {autoClose: 2000})
            })
            .catch(error => toast.warn('Une erreur est survenue.', {autoClose: 2000}))
            close(false)
        }else{
            setAvatarEmpty(true)
        }
    }

    return (
        <div className='modifyAvatar' onSubmit={changeAvatar}>
            <form className='modifyAvatar--form'>
                <h3>Modification d'avatar</h3>
                <hr className='post--hrLarge'></hr>

                {/* Ajouter une image au formulaire */}
                <label htmlFor='imageInput'>
                    <i className="fa-solid fa-image"></i>
                    { avatar ? avatar.name : "Ajouter une image" }                   
                </label>
                <input type="file" id='imageInput' accept="image/png, image/jpeg, image/jpg, image/gif" onChange={e => setAvatar(e.target.files[0])} />

                {/* Message d'erreur en cas d'avatar non ajouté */}
                { avatarEmpty && 
                    <p className="createPost--form__notValid">
                        <i className="fa-solid fa-triangle-exclamation"></i>
                        Vous devez ajouter une image pour changer d'avatar.
                    </p>
                }

                {/* Box de soumission du formulaire / fermeture du modal */}
                <div className='modifyAvatar--form__subBtn'>
                    <input type="submit" />
                    <button onClick={() => close(false)}>Annuler</button>
                </div>
            </form>
        </div>
    )
}

export default ChangeAvatar