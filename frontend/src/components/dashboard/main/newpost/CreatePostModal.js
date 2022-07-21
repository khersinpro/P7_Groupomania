import React, { useContext, useState } from "react"
import { userContext } from "../../../context/UserContext"
import axios from "axios"
import dayjs from 'dayjs';

const CreatePostModal = ({close}) => {
    const {user, refresh, setRefresh} = useContext(userContext)
    const [postImg, setPostImg] = useState();
    const [postText, setPostText] = useState();
    const [validPost, setValidPost] = useState(true)
    // Fonction pour envoyer un nouveau POST
    const sendPost = async (e) => {
        e.preventDefault();
        // controle pour eviter l'envoi de POST vide
        if(postImg || postText && postText.trim()){
            const data = new FormData();
            const date = dayjs(new Date()).format('DD/MM/YYYY HH:mm');
            postImg && data.append("postImg", postImg)
            postText && data.append("message", postText)
            data.append("user_id", user.id)
            data.append("date", date)

            await axios({
                method: "post",
                url: "http://localhost:3000/api/post/create",
                withCredentials: true,
                data
            })
            .then(() => {
                setRefresh(!refresh)
                close(false)
            })
            .catch(error => console.log(error))
        }else{
            setValidPost(false)
        }
    }
    return (
        <div className="createPost">
            <form className="createPost--form" onSubmit={sendPost}>
                <h3>Crée une publication</h3>
                <div className="createPost--form__closeForm" onClick={() => close(false)}>
                    <i class="fa-solid fa-xmark"></i>
                </div>
                <hr className='post--hrLarge'></hr>
                <textarea onChange={e => setPostText(e.target.value)} placeholder={'Quoi de neuf ' + user.firstname + " ?"} />
                <label htmlFor="post-img">
                    <i class="fa-solid fa-image"></i>
                    {postImg ? postImg.name : "Ajout d'une image"}
                </label>
                <input type="file" id='post-img' accept="image/png, image/jpeg, image/jpg, image/gif" onChange={e => setPostImg(e.target.files[0])}/>
                {!validPost &&
                    <p className="createPost--form__notValid">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        Votre nouvelle publication ne peux pas être vide.
                    </p>
                }
                <input type="submit"/>
            </form>
        </div>
    )
}

export default CreatePostModal