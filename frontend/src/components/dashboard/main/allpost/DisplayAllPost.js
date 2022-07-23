import React, {useEffect, useContext, useState} from 'react'
import { userContext } from '../../../context/UserContext'
import { postContext } from '../../../context/PostContext'
import axios from 'axios'
import DisplayPost from './post_display/DisplayPost'


const DisplayAllPost = () => {
    // CONTEXT USER ET STATE POUR LES POST/COM
    const {user} = useContext(userContext);
    const [allPosts, setAllPosts] = useState([]);
    // Instance d'axios pour ajouter les credentials automatiquement
    const instance = axios.create( {withCredentials: true} );

    // Fonction de récupération de tout les POSTS
    const getAllPosts = () => {
        instance.get(`http://localhost:3000/api/post/getall/${user.id}`)
        .then(res => setAllPosts(res.data))
        .catch(error => console.log(error))
    }

    // Récupération de tout les POST quand un user est connecté
    useEffect(() => {
        user.id !== "" && getAllPosts();
    }, [user])

    return (
    <postContext.Provider value={getAllPosts} >
        <section className='postContainer'>
            {       
                allPosts.map(post => <DisplayPost key={post.post_id} post={post} />)
            }
        </section>
    </postContext.Provider>
    )
}

export default DisplayAllPost