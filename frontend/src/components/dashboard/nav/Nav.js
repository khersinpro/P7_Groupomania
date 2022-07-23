import React, {useContext, useState} from 'react'
import { userContext } from '../../context/UserContext'
import logo from '../../../assets/Groupomania+Logos/Groupomania Logos (update 2022)/icon-left-font-monochrome-white.png'
import ChangeAvatar from './functionality/ChangeAvatar'
import axios from 'axios'

const Nav = () => {
    const {user} = useContext(userContext);
    const [openAvatar, setOpenAvatar] = useState(false)
    return (
        <>
            <header className='dashboard--header'>
                <nav className='dashNav'>
                    <div className='dashNav--firstBloc'>
                        <img className='dashNav--firstBloc__logo' src={logo} alt='groupomania logo' />
                        <div className='dashNav--firstBloc__userInfo' >
                            <div className='avatar'>
                                <img src={`http://localhost:3000/images/avatar/${user.url}`} alt="navbar avatar"/>
                            </div>
                            <h2>{user.name + " " + user.firstname}</h2>
                        </div>
                        <button onClick={() => setOpenAvatar(true)}><i className="fa-solid fa-camera"></i> Changement d'avatar</button>
                        <button><i className="fa-solid fa-lock"></i> Changement de mot de passe</button>
                        <button><i className="fa-solid fa-user-xmark"></i> Suppression du compte</button>
                    </div>
                    <div className='dashNav--secondBloc'>
                        <button><i className="fa-solid fa-right-from-bracket"></i> Deconnexion</button>
                    </div>
                </nav>
            </header>
            {openAvatar && <ChangeAvatar close={setOpenAvatar} />}
        </>
    )
}

export default Nav