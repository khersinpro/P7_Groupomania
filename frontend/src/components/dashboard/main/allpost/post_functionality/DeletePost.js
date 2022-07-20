import axios from 'axios';
import React, {useContext} from 'react'
import { userContext } from '../../../../context/UserContext';

const DeletePost = ({user, post,close}) => {
    // Appel du context pour rafraichir l'affichage des posts aprés modification
    const {refresh, setRefresh} = useContext(userContext)
    // Fonction de suppression du post avec controle + requete axios
    const deletePost = async (e) => {
        e.preventDefault();
        if(user.id === post.userId || user.admin === 1){
            const data = {user_id: user.id, post_id: post.post_id}
            await axios({
                method: "delete",
                url: 'http://localhost:3000/api/post/delete',
                withCredentials: true,
                data
            })
            .then(res => console.log(res))
            .catch(error => console.log(error))
            // Rafraichissement des post et fermeture du modal
            setRefresh(!refresh)
            close(false)
        }
    }
    return (
        <div className='changeModal'>
            <div className='deletePost'>
                <h4>Etes-vous sur de vouloir supprimer ce commentaire ?</h4>
                <div className='deletePost--btnBox'>
                    <button onClick={deletePost}>Oui</button>
                    <button onClick={() => close(false)}>Non</button>
                </div>
            </div>
        </div>
    )
}

export default DeletePost