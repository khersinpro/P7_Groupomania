import React, {useState, useContext} from 'react'
import axios from 'axios'
import { postContext } from '../../../../context/PostContext';
import { toast } from 'react-toastify';

const ModifyPost = ({post, user, close}) => {
    // State qui recupére le text du formulaire
    const [textChange, setTextChange] = useState(post.message);
    // State qui recupére l'image du formulaire
    const [imageChange, setImageChange] = useState();
    // Appel du context pour rafraichir l'affichage des posts aprés modification
    const {getAllPosts} = useContext(postContext)
    // Instance d'axios pour ajouter les credentials et la base de l'URL automatiquement 
    const instance = axios.create( {withCredentials: true, baseURL: "http://localhost:3000" } );

    // Fonction pour sauvegarder les modification dans la base avec contrôle
    const sendChange = async  (e) => {
        // Controle de l'utilisateur
        if(user.id !== post.userId || user.admin !== 1){
            close(false)
            return toast.warn("Vous ne pouvez pas modifier ce post.",{autoClose: 2000})
        }

        e.preventDefault();
        const data = new FormData();
        // Si le message du post a etait modifié, on l'ajoute au FormData
        textChange !== post.message && data.append("message", textChange);
        // Si l'image du post a été modifié, on l'ajoute au FormData
        imageChange && data.append("postImg", imageChange);
        // Ajout des informations user au FormData
        data.append("user_id", user.id);
        data.append("post_id", post.post_id);
        data.append("admin", user.admin);

        // Si il y a eu une modification
        if(textChange !== post.message || imageChange){
            await instance.put("/api/post/modify", data)
            .then(res => toast.success("Modification réussi !", {autoClose: 2000}))
            .catch(error => toast.warn("Une erreur est survenue ...", {autoClose: 2000}))
            getAllPosts()
        }
        // fermeture du modal
        close(false)
    }
    console.log(imageChange);

    return (
        <div className='changeModal'>
            <form className='changeModal--form' onSubmit={sendChange}>
                {/* Ajout des modifications */}
                <h4>Souhaitez vous ajouter des modifications ?</h4>
                <hr className='hrLarge' />

                <label htmlFor='text-change'>Modification du text</label>
                <input type='text' id='text-change' value={textChange} onChange={e => setTextChange(e.target.value)}/>

                <label className='changeModal--form__imgLab' htmlFor='image--change'>
                    <i class="fa-solid fa-image"></i>
                    {imageChange ? imageChange.name : "Ajouter une image"}
                </label>
                <input type="file" id='image--change' accept="image/png, image/jpeg, image/jpg, image/gif" onChange={e => setImageChange(e.target.files[0])}  />
                
                {/* Boutons pour annuler ou envoyer les modifications */}
                <div className='changeModal--subBox'>
                    <input type="submit" value="Envoyer" />
                    <button type='button' onClick={() => close(false)}>Fermer</button>
                </div>
            </form>
        </div>
    )
}

export default ModifyPost