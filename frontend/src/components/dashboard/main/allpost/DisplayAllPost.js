import React, {useContext} from 'react'
import { postContext } from '../../../context/PostContext'
import DisplayPost from './post_display/DisplayPost'


const DisplayAllPost = () => {
    // Récupération de tout les POSTS avec le postContext
    const {allPosts} = useContext(postContext);

    return (  
    <section className='postContainer'>
        {/* MAP pour afficher tout les POSTS */}
        { allPosts.map(post => <DisplayPost key={post.post_id} post={post} />) }
    </section>
    )
}

export default DisplayAllPost