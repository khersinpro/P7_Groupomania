import React, {useContext, useState} from 'react'
import { userContext } from '../../../context/UserContext'
import CreatePostModal from './CreatePostModal';

const NewPost = () => {
  // Récupération du context USER
  const {user} = useContext(userContext);
  // State d'ouverture et de fermeture du MODAL de nouvelle PUBLICATION
  const [openCreateModal, setOpenCreateModal] = useState(false);

  return (
    <>
      <div className='newPost box-style'>
        <div className='newPost--image'>
          <img src={`http://localhost:3000/images/avatar/${user.url}`} alt='photo de profil'  />
        </div>
        
        <div className='newPost--fakebtn' onClick={() => setOpenCreateModal(true)}>
          <p>{"Quoi de neuf " + user.firstname + " ?"}</p>
        </div>
      </div>

      {/* Modal de création d'une nouvelle PUBLICATION */}
      {openCreateModal && <CreatePostModal close={setOpenCreateModal} />}
    </>
  )
}

export default NewPost