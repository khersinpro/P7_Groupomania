import React, {useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import {userContext}  from '../components/context/UserContext'

const NotFound = () => {
    const { userConnected } = useContext(userContext)
    let navigate = useNavigate()

    const redirect = () => {
        if(userConnected){
            navigate('/dashboard')
        }else{
            navigate('/home')
        }
    }

    return (
        <main className='notfound'>
            <h1 >Oups, cette page n'existe pas ...</h1>
            <button className='button-style' 
                type='button'onClick={() => redirect()} 
                aria-label='redirection au menu principal'
            >
                Acceuil
            </button>
        </main>
    )
}

export default NotFound