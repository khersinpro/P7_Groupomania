import React,{useState, useContext} from 'react'
import { userContext } from '../../../../context/UserContext'
import ModifyPost from '../post_functionality/ModifyPost'
import DeletePost from '../post_functionality/DeletePost'

const DisplayPost = ({post}) => {
    // Ouverture/Fermeture du modal
    const [modal, setModal] = useState(false)
    // Ouverture de la modification du POST
    const [modifyPost, setModifyPost] = useState(false)
    // Ouverture de la Suppression d'un post
    const [deletePost, setDeletePost] = useState(false)
    // Infos utilisateur
    const {user} = useContext(userContext)

    return (
    <>
        <div className='post--userPres'>
            <div className='post--userPres__avatar'></div>
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
        <p className='post--message'>{post.message}</p>
        {/* Si le post contiens un image */}
        {
            post.posturl && <img src={'http://localhost:3000/images/post/' + post.posturl}/>
        }
        <hr className='post--hrSmall'></hr>
        {/* Fonction de like */}
        <div className='post--like'>
            <div className="heart-container">
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