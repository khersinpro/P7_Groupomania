import React,{useState, useContext} from 'react'
import { userContext } from '../../../../context/UserContext'
import ModifyPost from '../post_functionality/ModifyPost'
import DeletePost from '../post_functionality/DeletePost'
import DisplayCom from './DisplayCom'
import dayjs from 'dayjs';
import axios from 'axios'

const DisplayPost = ({post}) => {
    // Ouverture/Fermeture du modal
    const [modal, setModal] = useState(false)
    // Ouverture de la modification du POST
    const [modifyPost, setModifyPost] = useState(false)
    // Ouverture de la Suppression d'un post
    const [deletePost, setDeletePost] = useState(false)
    // Infos utilisateur
    const {user} = useContext(userContext)
    // Récuperation des commentaire du post
    const [comments, setComments] = useState([])
    // Nouveau commentaire si il y en a un
    const [newCom, setNewCom] = useState("");
    // Affichage des likes si modification
    const [totalLikes, settotalLikes] = useState();
    // Instance d'axios pour ajouter les credentials automatiquement
    const instance = axios.create( {withCredentials: true} );

    // Fonction pour like/dislike un POST
    const sendLike = async () => {
        await instance.post("http://localhost:3000/api/post/likes", {post_id: post.post_id, user_id: user.id} )
        .then(() => getLikes())
        .catch(error => console.log(error))
    }

    //Fonction de rafraichissement des likes d'un POST
    const getLikes = async () => {
        await instance.get(`http://localhost:3000/api/post/getpostlikes/${post.post_id}`)
        .then( res => settotalLikes(res.data) )
        .catch(error => console.log(error))
    }
    
    // Récupération des commentaire du post
    const getCom = async (e) => {
        if(e && comments.length < 1  && post.nbComs < 1) return console.log("Aucun commentaire a afficher.");
        if(e && comments.length > 0) return console.log("Aucun commentaire a afficher.");
        await instance.get(`http://localhost:3000/api/comment/getpostcom/${post.post_id}`)
        .then( res => setComments(res.data))
        .catch(error => setComments([]))
    }

    // Fonction pour envoyer un nouveau commentaire
    const sendCom = (e) => {
        e.preventDefault();
        if(newCom){
            const date = dayjs(new Date()).format('DD/MM/YYYY HH:mm');
            instance.post('http://localhost:3000/api/comment/create', {post_id: post.post_id, comment: newCom, date, user_id: user.id } )
            .then(() => getCom())
            .catch(error => console.log(error))
            setNewCom("")
        }else{
            console.log("pas de commentaire");
        }
    }

    // Fonction de suppression d'un commentaire
    const deleteCom = (id) => {
        instance.delete("http://localhost:3000/api/comment/delete", {data: {user_id: user.id, id}} )
        .then(() => getCom())
        .catch(error => console.log(error))
    }

    return (
    <div className='post'>
        <div className='post--userPres'>
            <div className='post--userPres__avatar'>
                <img src={`http://localhost:3000/images/avatar/${post.url}`} alt='photo de profil'  />
            </div>

            <div className='post--userPres__text'>
                <h3>{post.firstname + " " + post.name}</h3>
                <p>Le {post.date}</p>
            </div>

            {/* Si le post appartien au User connecté, le tableau de modification/suppression apparait */}
            {user.id === post.userId &&
                <div className='post--userPres__ellipsis'>
                    <button onClick={() => setModal(!modal)}>
                    <i className="fa-solid fa-ellipsis"></i>
                </button>
            </div>
            }
        </div>

        <hr className='post--hrLarge'></hr>

        {/*CONTENU DU POST / Si le post contient un message / Si le post contiens un image */}
        {post.message && <p className='post--message'>{post.message}</p>}
        {post.posturl && <img className='post--img' src={'http://localhost:3000/images/post/' + post.posturl} alt='post image'/> }

        <hr className='post--hrSmall'></hr>

        {/* Fonction de Like/Dislike du POST et affichage dynamique du nb de likes / si il est Like par l'User*/}
        <div className='post--like'>
            <div className="heart-container" onClick={sendLike}>
                <i className="fa-regular fa-heart nocolor"></i>
                {totalLikes ?
                    <i className={`fa-solid fa-heart ${ totalLikes.isLiked > 0 ? "liked" : "colored"}`}></i>
                    :
                    <i className={`fa-solid fa-heart ${ post.isLiked > 0 ? "liked" : "colored"}`}></i>
                }
            </div>
            <p>{totalLikes ? totalLikes.likes : post.nbLikes} Likes</p>

            {/* Boutons d'affichage des commentaire et de leurs nombres  */}
            <div onClick={e => getCom(e)} className='post--like__comBtn' >
                <i class="fa-solid fa-comment"></i>
                <p>{comments.length > 0 ? comments.length : post.nbComs} commentaire</p>
            </div>
        </div>

        <hr className='post--hrLarge'></hr>

        {/* Modal pour choisir d'apporter une modification au POST ou le supprimer */}
        {modal &&
            <div className='modifModal'>
                <p onClick={() => { setModifyPost(true); setModal(!modal)}}>Modifier</p>
                <p onClick={() => { setDeletePost(true); setModal(!modal)}}>Supprimer</p> 
            </div>
        }

        {/* Modal de modification de POST */}
        {modifyPost && <ModifyPost close={setModifyPost} user={user} post={post}/>}

        {/* Modal de suppression de POST */}
        {deletePost && <DeletePost close={setDeletePost} user={user} post={post}/>}
        
        {/* Affichages des commentaire du POST au clic sur l'icon com*/}
        <div className='post--comContainer'>
            { comments.map(com => < DisplayCom key={com.id} com={com} reload={getCom} deleteCom={deleteCom} />) }
        </div>

        {/* Formulaire de soumission d'un nouveau COM */}
        <form className="post--form" onSubmit={sendCom}>
            <div className="post--form__avatar">
                <img src={`http://localhost:3000/images/avatar/${user.url}`} alt='photo de profil'  />
            </div>
            <input type='test' placeholder='Nouveau commentaire' value={newCom} onChange={e => setNewCom(e.target.value)} />
        </form>
    </div>
    ) 
}

export default DisplayPost