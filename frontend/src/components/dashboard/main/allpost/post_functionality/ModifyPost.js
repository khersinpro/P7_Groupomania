import React, {useState, useContext} from 'react'
import { postContext } from '../../../../context/PostContext';
import { toast } from 'react-toastify';

const ModifyPost = ({post, user, close, instance}) => {
    // State qui recupére le text du formulaire
    const [textChange, setTextChange] = useState(post.message);
    // State qui recupére l'image du formulaire
    const [imageChange, setImageChange] = useState();
    // Appel du context pour rafraichir l'affichage des posts aprés modification
    const {getAllPosts} = useContext(postContext)

    // Fonction pour sauvegarder les modification dans la base avec contrôle
    const sendChange = async  (e) => {
        e.preventDefault();
        // Controle de l'utilisateur
        if((user.id === post.userId || user.admin === 1)){
            const data = new FormData();
            // Si le message du post a etait modifié, on l'ajoute au FormData
            textChange !== post.message && data.append("message", textChange);
            // Si l'image du post a été modifié, on l'ajoute au FormData
            imageChange && data.append("postImg", imageChange);
            // Ajout des informations user au FormData
            data.append("user_id", user.id);
            data.append("post_id", post.post_id);
            // Si il y a eu une modification
            if(textChange !== post.message || imageChange){
                await instance.put("/api/post/modify", data)
                .then(res => toast.success("Modification réussi !", {autoClose: 2000}))
                .catch(error => toast.warn("Une erreur est survenue ...", {autoClose: 2000}))
                getAllPosts()
            }
            // fermeture du modal
        }else{            
            close(false)
            return toast.warn("Vous ne pouvez pas modifier ce post.",{autoClose: 2000})
        }
        close(false)
    }

    // Ciblage de l'input type file
    const hiddenFileInput = React.useRef(null);

    // Lancement de l'input de type file avec le keyPress Enter
    const handleClick = event => {
        if(event.key === "Enter"){
            hiddenFileInput.current.click();
        }
    };

    return (
        <div className='changeModal'>
            <form className='changeModal--form box-style' onSubmit={sendChange}>
                {/* Ajout des modifications */}
                <h4>Souhaitez vous ajouter des modifications ?</h4>
                <hr className='hrLarge' />

                <label htmlFor='text-change'>Modification du text</label>
                <input type='text' id='text-change' value={textChange} onChange={e => setTextChange(e.target.value)}/>

                {/* Gestion de la modification et de la suppression d'une image d'un post */}
                {post.posturl ?
                    <label className='changeModal--form__imgLab' htmlFor='image--change' onKeyDown={handleClick} 
                    role='button' tabIndex="0" aria-label="Modifier l'image">
                        <i className="fa-solid fa-image"></i>
                        {imageChange ? imageChange.name : "Modifier l'image"}
                    </label>
                    :
                    <label className='changeModal--form__imgLab' htmlFor='image--change' onKeyDown={handleClick} 
                    role='button' tabIndex="0" aria-label="Ajouter une image">
                        <i className="fa-solid fa-image"></i>
                        {imageChange ? imageChange.name : "Ajouter une image"}
                    </label>
                }
                <input type="file" id='image--change' accept="image/png, image/jpeg, image/jpg, image/gif" onChange={e => setImageChange(e.target.files[0])} 
                    ref={hiddenFileInput}
                />
                
                {/* Boutons pour annuler ou envoyer les modifications */}
                <div className='changeModal--subBox'>
                    <button className='button-style' type="submit" aria-label='Envoyer les modifications' >Envoyer</button>
                    <button className='button-style' type='button' aria-label='Fermer' onClick={() => close(false)}>Annuler</button>
                </div>
            </form>
        </div>
    )
}

export default ModifyPost