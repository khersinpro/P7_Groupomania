import React, {useEffect, useContext, useState} from 'react'
import axios from 'axios'
import { userContext } from '../../../context/UserContext'

const DisplayAllPost = () => {
    const {user} = useContext(userContext);
    const [post, setPost] = useState([])
    const [com, setCom] = useState([])

    useEffect(() => {
        // Recupération des postz et des coms
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
    
    return (
        <main>
            {
                // map des post de façon dynamique
                post.map(post => (
                    <div key={post.post_id}>
                        <h3>{post.firstname}</h3>
                        <p>{post.date}</p>
                        <p>{post.message}</p>
                        {
                            post.posturl && <img src={'http://localhost:3000/images/post/' + post.posturl}/>
                        }
                        {
                            // permet de filtrer les resultats voulu puis de les afficher grace a map
                            com.filter(com => com.post_id === post.post_id).map(res => (
                                <div key={res.id}> 
                                    <p>{res.firstname + " " + res.name}</p>
                                    <p>{res.comment}</p>
                                </div>
                            ))
                        }
                    </div>
                ))
            }
        </main>
    )
}

export default DisplayAllPost