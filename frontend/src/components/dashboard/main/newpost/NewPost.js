import React, {useContext, useState} from 'react'
import { userContext } from '../../../context/UserContext'
import CreatePostModal from './CreatePostModal';

const NewPost = () => {
  const {user} = useContext(userContext);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  return (
    <>
    <div className='newPost'>
      <div className='newPost--image'>
        <img src={`http://localhost:3000/images/avatar/${user.url}`} alt='photo de profil'  />
      </div>
      <div className='newPost--fakebtn' onClick={() => setOpenCreateModal(true)}>
        <p>{"Quoi de neuf " + user.firstname + " ?"}</p>
      </div>
    </div>
    {openCreateModal && <CreatePostModal close={setOpenCreateModal} />}
    </>
  )
}

export default NewPost