import React from 'react'
import axios from 'axios'

const DeleteCom = ({user, post}) => {


    return (
        <div className='changeModal'>
            <div>
                <h4>Etes-vous sur de vouloir supprimer ce commentaire ?</h4>
                <button>Oui</button>
                <button>Non</button>
            </div>
        </div>
    )
}

export default DeleteCom