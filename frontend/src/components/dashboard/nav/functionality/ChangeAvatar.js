import React, {useState, useContext} from 'react'
import { userContext } from '../../../context/UserContext'
import { toast } from 'react-toastify';

const ChangeAvatar = ({close}) => {
    // State pour stocker l'avatar de l'utilisateur
    const [avatar, setAvatar] = useState();
    // State d'affichage d'erreur
    const [avatarEmpty, setAvatarEmpty] = useState(false)
    // Import des données du userContext
    const {user, refresh, setRefresh, instance} = useContext(userContext);

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

    // Ciblage de l'input type file
    const hiddenFileInput = React.useRef(null);
    
    // Lancement du l'abel de l'input de type file avec le keyPress Enter
    const handleClick = event => {
        if(event.key === "Enter"){
            hiddenFileInput.current.click();
        }
    };

    return (
        <div className='modifyAvatar' >
            <form className='modifyAvatar--form box-style' onSubmit={changeAvatar}>
                <h3>Modification d'avatar</h3>
                <hr className='hrLarge' role="separator"></hr>

                {/* Ajouter une image au formulaire */}
                <label htmlFor='imageInput' tabIndex="3" role="button" onKeyDown={handleClick} >
                    <i className="fa-solid fa-image"></i>
                    { avatar ? avatar.name : "Ajouter une image" }                   
                </label>
                <input ref={hiddenFileInput} type="file" id='imageInput' accept="image/png, image/jpeg, image/jpg, image/gif" onChange={e => setAvatar(e.target.files[0])} aria-required="true"/>

                {/* Message d'erreur en cas d'avatar non ajouté */}
                { avatarEmpty && 
                    <p className="createPost--form__notValid">
                        <i className="fa-solid fa-triangle-exclamation"></i>
                        Vous devez ajouter une image pour changer d'avatar.
                    </p>
                }

                {/* Box de soumission du formulaire / fermeture du modal */}
                <div className='modifyAvatar--form__subBtn'>
                    <button tabIndex="4" className='button-style' type="submit">Envoyer</button>
                    <button tabIndex="5" className='button-style' type='button' onBlur={() => close(false)} onClick={() => close(false)}>Annuler</button>
                </div>
            </form>
        </div>
    )
}

export default ChangeAvatar