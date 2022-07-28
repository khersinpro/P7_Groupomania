import React, {useContext} from 'react'
import { userContext } from '../../../../context/UserContext'


const DisplayCom = ({com, deleteCom}) => {
    const {user} = useContext(userContext)

    return (
        <div> 
            <div className='com'>
                <div className='com--avatar'>
                    <img src={`http://localhost:3000/images/avatar/${user.id === com.user_id ? user.url : com.url}`} alt='Avatar du créateur du commentaire'  />
                </div>

                <div className='com--text'>
                    <h4>{com.firstname + " " + com.name}</h4>
                    <p className='com--text__date'>Le {com.date}</p>
                    <p className='com--text__message'>{com.comment}</p>
                </div> 
                {
                    (user.admin === 1 || user.id === com.user_id) &&
                    <button className='com--deleteCom' onClick={() => deleteCom(com.id, com.user_id)} type='button' aria-label='Supprimer commentaire'>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                }
            </div>
        </div>
    )
}

export default DisplayCom