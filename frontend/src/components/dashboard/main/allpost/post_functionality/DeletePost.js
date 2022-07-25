import axios from 'axios';
import React, {useContext} from 'react'
import { postContext } from '../../../../context/PostContext';
import { toast } from 'react-toastify';

const DeletePost = ({user, post, close}) => {
    // Appel du context pour rafraichir l'affichage des posts aprés modification
    const { getAllPosts } = useContext(postContext)
    // Instance d'axios pour ajouter les credentials et la base de l'URL automatiquement 
    const instance = axios.create( {withCredentials: true, baseURL: "http://localhost:3000" } );

    // Fonction de suppression du post avec controle + requete axios
    const deletePost = async (e) => {
        e.preventDefault();
        if(user.id === post.userId || user.admin === 1){
            await instance.delete('/api/post/delete', {data: {user_id: user.id, post_id: post.post_id}} )
            .then(res => {
                toast.success("Suppression réussi !", {autoClose: 2000})
            })
            .catch(error => toast.warn("Une erreur est survenue ...", {autoClose: 2000}))
            // Fermeture du modal
            close(false)
            getAllPosts()
        }else{
            toast.warn("Vous ne pouvez pas supprimer ce post.",{autoClose: 2000})
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