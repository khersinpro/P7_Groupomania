import React, {useContext} from 'react'
import { userContext } from '../../context/UserContext'
import logo from '../../../assets/Groupomania+Logos/Groupomania Logos (update 2022)/icon-left-font-monochrome-white.png'
import axios from 'axios'

const Nav = () => {
    const {user} = useContext(userContext);

  return (
    <header className='dashboard--header'>
        <nav className='dashNav'>
            <div className='dashNav--firstBloc'>
                <img className='dashNav--firstBloc__logo' src={logo} alt='groupomania logo' />
                <div className='dashNav--firstBloc__userInfo' >
                    <img className='avatar' src='http://localhost:3000/images/post/Shape.png1658059424105.png' />
                    <h2>{user.name + " " + user.firstname}</h2>
                </div>
                <button>Changement d'avatar</button>
                <button>Changement de mot de passe</button>
                <button>Suppression du compte</button>
            </div>
            <div className='dashNav--secondBloc'>
                <button>Deconnexion</button>
            </div>
        </nav>
    </header>
  )
}

export default Nav