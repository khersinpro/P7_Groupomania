import React from 'react'

const DisplayCom = ({com, deleteCom}) => {
    return (
        <div> 
            <div className='com'>
                <div className='com--avatar'>
                    <img src={`http://localhost:3000/images/avatar/${com.url}`} alt='photo de profil'  />
                </div>

                <div className='com--text'>
                    <h4>{com.firstname + " " + com.name}</h4>
                    <p className='com--text__date'>Le {com.date}</p>
                    <p className='com--text__message'>{com.comment}</p>
                </div> 

                <div className='com--deleteCom' onClick={() => deleteCom(com.id)}>
                    <i className="fa-solid fa-xmark"></i>
                </div>
            </div>
        </div>
    )
}

export default DisplayCom