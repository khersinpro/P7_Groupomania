import React, {useState} from 'react'
import axios from 'axios'

const ModifyPost = ({post, user, close}) => {
    const [textChange, setTextChange] = useState(post.message);
    const [imageChange, setImageChange] = useState();
    const sendChange = async  (e) => {
        e.preventDefault();
        const data = new FormData();
        // Si le message du post a etait modifié, on l'ajoute au FormData
        textChange !== post.message && data.append("message", textChange);
        // Si l'image du post a été modifié, on l'ajoute au FormData
        imageChange && data.append("postImg", imageChange);
        // Ajout des informations user au FormData
        data.append("user_id", user.id);
        data.append("post_id", post.post_id);
        data.append("admin", user.admin)
        // Si il y a eu une modification
        if(textChange !== post.message || imageChange){
            await axios({
                method: 'put',
                url:"http://localhost:3000/api/post/modify",
                withCredentials: true,
                data
            })
            .then(res => console.log(res))
            .catch(error => console.log(error))
        }
        close(false)
    }
    return (
        <div className='changeModal'>
            <form onSubmit={sendChange}>
                {/* Ajout des modifications */}
                <h4>Souhaitez vous ajouter des modifications ?</h4>
                <hr className='hrLarge' />
                <label htmlFor='text-change'>Modification du text</label>
                <input type='text' id='text-change' value={textChange} onChange={e => setTextChange(e.target.value)}/>
                <label htmlFor='image-change'>{post.posturl ? "Modifier l'image" : "Ajouter une image"}</label>
                <input type="file" id='imageInput' accept="image/png, image/jpeg, image/jpg, image/gif" onChange={e => setImageChange(e.target.files[0])}  />
                {/* Boutons pour annuler ou envoyer les modifications */}
                <div className='changeModal--subBox'>
                    <input type="submit" value="Envoyer" />
                    <button onClick={() => close(false)}>Fermer</button>
                </div>
            </form>
        </div>
    )
}

export default ModifyPost