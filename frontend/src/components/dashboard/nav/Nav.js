import React, {useContext} from 'react'
import { userContext } from '../../context/UserContext';
import axios from 'axios'

const Nav = () => {
    const {user} = useContext(userContext);

  return (
    <header>
        <nav>
            <h2>{user.name} {user.firstname}</h2>
            <button>Changement d'avatar</button>
            <button>Changement de mot de passe</button>
            <button>Suppression du compte</button>
            <button>Deconnexion</button>
        </nav>
    </header>
  )
}

export default Nav