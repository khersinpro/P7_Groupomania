import React, {useEffect, useContext, useState} from 'react'
import axios from 'axios'
import { userContext } from '../../../context/UserContext'

const DisplayAllPost = () => {
    const {user} = useContext(userContext);
    const [post, setPost] = useState([])
    const [com, setCom] = useState([])
    console.log(com)
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
    
    let coms ;
    return (
        <section className='postContainer'>
            {
                // map des post de façon dynamique
                post.map(post => (
                    
                    
                    <div key={post.post_id} className='post'>
                        <div className='post--userPres'>
                            <div className='post--userPres__avatar'></div>
                            <div className='post--userPres__text'>
                                <h3>{post.firstname + " " + post.name}</h3>
                                <p>Le {post.date}</p>
                            </div>
                        </div>
                        <hr className='post--hrLarge'></hr>
                        <p className='post--message'>{post.message}</p>
                        {
                            post.posturl && <img src={'http://localhost:3000/images/post/' + post.posturl}/>
                        }
                        <hr className='post--hrSmall'></hr>
                        <div className='post--like'>
                            <button>Like</button>
                        </div>
                        <hr className='post--hrLarge'></hr>
                        <div className='post--comContainer'>
                            {
                                // permet de filtrer les resultats voulu puis de les afficher grace a map   
                                com.filter(com => com.post_id === post.post_id)
                                .map(res => (
                                    <div key={res.id}> 
                                        <div className='com'>
                                            <div className='com--avatar'></div>
                                            <div className='com--text'>
                                                <h4>{post.firstname + " " + post.name}</h4>
                                                <p className='com--text__date'>Le {post.date}</p>
                                                <p className='com--text__message'>{res.comment}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                            <hr className='post--hrSmall'></hr>
                        <form>
                            <input type='test' placeholder='Nouveau commentaire'></input>
                        </form>
                    </div>
                ))
            }
        </section>
    )
}

export default DisplayAllPost