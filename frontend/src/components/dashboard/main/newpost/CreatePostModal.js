import React, { useContext, useState } from "react"
import { postContext } from "../../../context/PostContext";
import { userContext } from "../../../context/UserContext";
import { toast } from 'react-toastify';
import dayjs from 'dayjs';


const CreatePostModal = ({close}) => {
    // Importation des contexts
    const {getAllPosts} = useContext(postContext);
    const {user, instance} = useContext(userContext);
    // State pour la récupération de l'image du POST
    const [postImg, setPostImg] = useState();
    // State pour la récupération du text du POST
    const [postText, setPostText] = useState();
    // State de control pour l'affichage d'une erreur en cas d'envoie de POST vide
    const [validPost, setValidPost] = useState(true)

    // Fonction pour envoyer un nouveau POST
    const sendPost = async (e) => {
        e.preventDefault();
        // Controle pour eviter l'envoi de POST vide
        if(postImg || (postText && postText.trim())){
            // Création de la date du POST
            const date = dayjs(new Date()).format('DD/MM/YYYY HH:mm');
            // Création du formulaire de donnée
            const data = new FormData();
            postImg && data.append("postImg", postImg)
            postText && data.append("message", postText)
            data.append("user_id", user.id)
            data.append("date", date)
            
            // Envoie de la PUBLICATION avec la method POST
            await instance.post("/api/post/create", data )
            .then(() => { 
                getAllPosts(); 
                close(false) 
                toast.success("Post crée avec succés !", {autoClose: 2000})
            })
            .catch(error => toast.warn("Une erreur est survenue..."), {autoClose: 2000})
        }else{
            // Affichage du Message d'erreur en cas de POST vide
            setValidPost(false)
        }
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
        <div className="createPost">
            <form aria-label="Formulaire d'ajout de publication" className="createPost--form box-style" onSubmit={sendPost}>

                <h3>Crée une publication</h3>

                <hr className='hrLarge' role="separator"></hr>
                <textarea onChange={e => setPostText(e.target.value)} placeholder={'Quoi de neuf ' + user.firstname + " ?"} aria-label="Entrez le text de votre publication." />

                <label htmlFor="post-img" onKeyDown={handleClick} role='button' tabIndex="0" aria-label="Ajouter une image" >
                    <i className="fa-solid fa-image"></i>
                    {postImg ? postImg.name : "Ajout d'une image"}
                </label>
                <input ref={hiddenFileInput} type="file" id='post-img' accept="image/png, image/jpeg, image/jpg, image/gif" onChange={e => setPostImg(e.target.files[0])} />

                {/* Message d'erreur si l'utilisateur essaye d'envoyer un message vide */}
                {!validPost &&
                    <p className="createPost--form__notValid">
                        <i className="fa-solid fa-triangle-exclamation"></i>
                        Votre nouvelle publication ne peux pas être vide.
                    </p>
                }
                <input className='button-style' type="submit" aria-label="Envoie du formulaire"/>
                {/* Bouton de fermeture du modal */}
                <button type="button" className="createPost--form__closeForm" aria-label="Fermure du formulaire" onBlur={() => close(false)}  onClick={() => close(false)}>
                    <i className="fa-solid fa-xmark"></i>
                </button >
            </form>
        </div>
    )
}

export default CreatePostModal