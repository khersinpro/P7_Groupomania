import React,{useState, useContext} from 'react'
import { userContext } from '../../../../context/UserContext'
import ModifyPost from '../post_functionality/ModifyPost'
import DeletePost from '../post_functionality/DeletePost'
import axios from 'axios'

const DisplayPost = ({post}) => {
    // Ouverture/Fermeture du modal
    const [modal, setModal] = useState(false)
    // Ouverture de la modification du POST
    const [modifyPost, setModifyPost] = useState(false)
    // Ouverture de la Suppression d'un post
    const [deletePost, setDeletePost] = useState(false)
    // Infos utilisateur
    const {user, refresh, setRefresh} = useContext(userContext)
    // Fonction pour like/dislike un POST
    const sendLike = async () => {
        await axios({
            method: "post", 
            url: "http://localhost:3000/api/post/likes",
            withCredentials: true,
            data: {post_id: post.post_id, user_id: user.id}
        })
        .then(() => setRefresh(!refresh))
        .catch(error => console.log(error))
    }

    return (
    <>
        <div className='post--userPres'>
            <div className='post--userPres__avatar'>
                <img src={`http://localhost:3000/images/avatar/${user.url}`} alt='photo de profil'  />
            </div>
            <div className='post--userPres__text'>
                <h3>{post.firstname + " " + post.name}</h3>
                <p>Le {post.date}</p>
            </div>
            {/* Si le post appartien au User connecté, le tableau de modification/suppression apparait */}
            {user.id === post.userId &&
                <div className='post--userPres__ellipsis'>
                <button onClick={() => {
                    setModal(!modal)
                    console.log(modal);
                }}>
                    <i className="fa-solid fa-ellipsis"></i>
                </button>
            </div>
            }
        </div>
        <hr className='post--hrLarge'></hr>
        {/* Si le post contient un message */}
        {post.message && <p className='post--message'>{post.message}</p>}
        {/* Si le post contiens un image */}
        {post.posturl &&
            <img className='post--img' src={'http://localhost:3000/images/post/' + post.posturl} alt='post image'/>
        }
        <hr className='post--hrSmall'></hr>
        {/* Fonction de like */}
        <div className='post--like'>
            {/* Like/Dislike un POST */}
            <div className="heart-container" onClick={sendLike}>
                <i className="fa-regular fa-heart nocolor"></i>
                {post.nbLikes > 0 ?
                <i className="fa-solid fa-heart liked"></i>
                :
                <i className="fa-solid fa-heart colored"></i>
                }
            </div>
            <p>{post.nbLikes} Likes</p>
        </div>
        <hr className='post--hrLarge'></hr>
        {/* Modal pour apporter une mofication ou supprimer un post */}
        {modal &&
            <div className='modifModal'>
                <p onClick={() => {
                    setModifyPost(true)
                    setModal(!modal)
                }}>Modifier</p>
                <p onClick={() => {
                    setDeletePost(true);
                    setModal(!modal)
                }
                }>Supprimer</p>
            </div>
        }
        {/* Modal de modification de post */}
        {modifyPost && <ModifyPost close={setModifyPost} user={user} post={post}/>}
        {/* Modal de suppression de post */}
        {deletePost && <DeletePost close={setDeletePost} user={user} post={post}/>}
    </>
    ) 
}

export default DisplayPost