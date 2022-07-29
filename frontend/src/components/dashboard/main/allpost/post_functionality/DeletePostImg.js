import React, {useContext} from 'react'
import { postContext } from '../../../../context/PostContext';
import { toast } from 'react-toastify';

const DeletePostImg = ({user, post, close, instance}) => {
    // Appel du context pour rafraichir l'affichage des posts aprés modification
    const { getAllPosts } = useContext(postContext)

    // Fonction de suppression du post avec controle + requete axios
    const deletePostImg = async (e) => {
        e.preventDefault();
        if(user.id === post.userId || user.admin === 1){
            await instance.put('/api/post/imagedelete', {user_id: user.id, post_id: post.post_id} )
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
            <div className='deletePost box-style'>
                <h4>Etes-vous sur de vouloir supprimer l'image de la publication ?</h4>

                <div className='deletePost--btnBox'>
                    <button className='button-style' onClick={deletePostImg} type='button' aria-label='Supprimer'>Oui</button>
                    <button className='button-style' onClick={() => close(false)} type='button' aria-label='Fermer'>Non</button>
                </div>               
            </div>
        </div>
    )
}

export default DeletePostImg