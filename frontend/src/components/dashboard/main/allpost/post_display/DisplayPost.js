import React,{useState, useContext} from 'react'
import { userContext } from '../../../../context/UserContext'
import DeletePostImg from '../post_functionality/DeletePostImg'
import ModifyPost from '../post_functionality/ModifyPost'
import DeletePost from '../post_functionality/DeletePost'
import DisplayCom from './DisplayCom'
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import axios from 'axios'

const DisplayPost = ({post}) => {
    // Ouverture/Fermeture du modal
    const [modal, setModal] = useState(false)
    // Ouverture de la modification du POST
    const [modifyPost, setModifyPost] = useState(false)
    //Ouverture du modal de suppression d'image de post
    const [deletePostImg, setDeletePostImg] = useState(false)
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
    // Instance d'axios pour ajouter les credentials et la base de l'URL automatiquement 
    const instance = axios.create( {withCredentials: true, baseURL: "http://localhost:3000" } );

    // Fonction pour like/dislike un POST
    const sendLike = async () => {
        await instance.post("/api/post/likes", {post_id: post.post_id, user_id: user.id} )
        .then(() => getLikes())
        .catch(error => console.log(error))
    }

    //Fonction de rafraichissement des likes d'un POST
    const getLikes = async () => {
        await instance.get(`/api/post/getpostlikes/${post.post_id}`)
        .then( res => settotalLikes(res.data) )
        .catch(error => console.log(error))
    }
    
    // Récupération des commentaire du post
    const getCom = async (e) => {
        // Controle pour eviter des spam de requetes au clic
        if(e && comments.length < 1  && post.nbComs < 1 || e && comments.length > 0 ){
            return console.log("Aucun commentaire a afficher.");
        }
        await instance.get(`/api/comment/getpostcom/${post.post_id}`)
        .then( res => setComments(res.data))
        .catch(error => setComments([]))
    }

    // Fonction pour envoyer un nouveau commentaire
    const sendCom = (e) => {
        e.preventDefault();
        if(newCom && newCom.trim()){
            const date = dayjs(new Date()).format('DD/MM/YYYY HH:mm');
            instance.post('/api/comment/create', {post_id: post.post_id, comment: newCom, date, user_id: user.id } )
            .then(() => {
                getCom()
                toast.success("Commentaire envoyé !", {autoClose: 2000})
            })
            .catch(error => toast.warn("Une erreur est survenue ...", {autoClose: 2000}))
            setNewCom("")
        }else{
            toast.warn("Vous ne pouvez pas envoyer un commentaire vide.", {autoClose: 2000})
        }
    }

    // Fonction de suppression d'un commentaire
    const deleteCom = (id, user_id) => {
        if(user.admin === 1 || user.id === user_id){
            instance.delete("/api/comment/delete", {data: {user_id: user.id, id}} )
            .then(() => {
                getCom()
                toast.success('Commentaire supprimé !', {autoClose: 2000})
            })
            .catch(error => toast.warn('Une erreur est survenue', {autoClose: 2000}))
        }else{
            toast.warn('Vous ne pouvez pas supprimer ce commentaire.', {autoClose: 2000})
        }
    }

    return (
    <div className='post box-style'>
        <div className='post--userPres'>
            <div className='post--userPres__avatar'>
                <img src={`http://localhost:3000/images/avatar/${user.id === post.userId ? user.url : post.url}`} alt='photo de profil'  />
            </div>

            <div className='post--userPres__text'>
                <h3>{post.firstname + " " + post.name}</h3>
                <p>Le {post.date}</p>
            </div>

            {/* Si le post appartien au User connecté, le tableau de modification/suppression apparait */}
            {(user.id === post.userId || user.admin === 1) &&
                <div className='post--userPres__ellipsis'>
                    <button onClick={() => setModal(!modal)}>
                    <i className="fa-solid fa-ellipsis"></i>
                    </button>
            </div>
            }
        </div>

        <hr className='hrLarge'></hr>

        {/*CONTENU DU POST / Si le post contient un message / Si le post contiens un image */}
        {post.message && <p className='post--message'>{post.message}</p>}
        {post.posturl && <img className='post--img' src={'http://localhost:3000/images/post/' + post.posturl} alt='post image'/> }

        <hr className='hrSmall'></hr>

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
                <i className="fa-solid fa-comment"></i>
                <p>{comments.length > 0 ? comments.length : post.nbComs} commentaire</p>
            </div>
        </div>

        <hr className='hrLarge'></hr>

        {/* Modal pour choisir d'apporter une modification au POST ou le supprimer */}
        {modal &&
            <div className='modifModal box-style'>
                <p onClick={() => { setModifyPost(true); setModal(!modal)}}>Modifier le post</p>
                {post.posturl && <p onClick={() => { setDeletePostImg(true); setModal(!modal)}}>Supprimer l'image</p>}
                <p onClick={() => { setDeletePost(true); setModal(!modal)}}>Supprimer le post</p> 
            </div>
        }

        {/* Modal de modification de POST */}
        {modifyPost && <ModifyPost close={setModifyPost} user={user} post={post}/>}

        {/* Modal de suppression d'image */}
        {deletePostImg && <DeletePostImg close={setDeletePostImg} user={user} post={post}/> }

        {/* Modal de suppression de POST */}
        {deletePost && <DeletePost close={setDeletePost} user={user} post={post}/>}
        
        {/* Affichages des commentaire du POST au clic sur l'icon com*/}
        <div className='post--comContainer'>
            { comments.map(com => < DisplayCom key={com.id} com={com} reload={getCom} deleteCom={deleteCom} />) }
        </div>

        {comments.length > 0 && <hr className='hrLarge'></hr>}

        {/* Formulaire de soumission d'un nouveau COM */}
        <form className="post--form"  onSubmit={sendCom}>
            <div className="post--form__avatar">
                <img src={`http://localhost:3000/images/avatar/${user.url}`} alt='photo de profil'  />
            </div>
            <input type='test' placeholder='Nouveau commentaire' value={newCom} onChange={e => setNewCom(e.target.value)} />
        </form>
    </div>
    ) 
}

export default DisplayPost