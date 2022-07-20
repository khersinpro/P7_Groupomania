import React, {useEffect, useContext, useState} from 'react'
import { userContext } from '../../../context/UserContext'
import axios from 'axios'
import DisplayPost from './post_display/DisplayPost'
import DisplayCom from './post_display/DisplayCom'

const DisplayAllPost = () => {
    // CONTEXT USER ET STATE POUR LES POST/COM
    const {user} = useContext(userContext);
    const [post, setPost] = useState([]);
    const [com, setCom] = useState([]);

    useEffect(() => {
        // Recupération des POSTS et des COMS
        user.id !== "" &&
        axios.get(
            `http://localhost:3000/api/post/getall/${user.id}`,
            {withCredentials: true}
        )
        .then(res => {
            setCom(res.data.com)
            setPost(res.data.post)
        })
        .catch(error => console.log(error))
    }, [user])

    // Map de tous les POSTS avec leurs commentaires
    const postMap = post.map(post => (
        <div key={post.post_id} className='post'>
            <DisplayPost post={post} />
            <DisplayCom com={com} post={post.post_id} />
        </div>
    ))

    return (
        <section className='postContainer'>
            {postMap}
        </section>
    )
}

export default DisplayAllPost