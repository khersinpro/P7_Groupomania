import React, {useContext, useState} from 'react'
import { userContext } from '../../context/UserContext'
import logo from '../../../assets/Groupomania+Logos/Groupomania Logos (update 2022)/icon-left-font-monochrome-white.png'
import ChangeAvatar from './functionality/ChangeAvatar'
import ChangePassword from './functionality/ChangePassword'
import axios from 'axios'
import { toast } from 'react-toastify'

const Nav = () => {
    // Récupération des données utilisateur
    const {user, setUserConnected} = useContext(userContext);
    // State pour l'ouverture/fermeture du modal du changement d'avatar
    const [openAvatar, setOpenAvatar] = useState(false)
    // State pour l'ouverture/fermeture du modal de changement de mot de passe
    const [openPasswordModal, setOpenPasswordModal] = useState(false)
    // Instance d'axios pour ajouter les credentials et la base de l'URL automatiquement 
    const instance = axios.create( {withCredentials: true, baseURL: "http://localhost:3000" } );

    // Fonction de deconnexion
    const logout = () => {
        instance.get(`/api/user/logout/${user.id}`)
        .then(() => toast.success('Deconnexion réussi !', {autoClose: 2000}))
        .then(() => setUserConnected(false))
        .catch(error => toast.warn('Une erreur est survenue ...', {autoClose: 2000}))
    }

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
                    <button onClick={() => setOpenPasswordModal(true)}><i className="fa-solid fa-lock"></i> Changement de mot de passe</button>
                </div>

                <div className='dashNav--secondBloc' >
                    <button onClick={logout}><i className="fa-solid fa-right-from-bracket"></i> Deconnexion</button>
                </div>
            </nav>

        </header>
        {/* Modal pour le changement d'avatar d'utilisateur */}
        {openAvatar && <ChangeAvatar close={setOpenAvatar} />}
        {/* Modal de changement de mot de passe */}
        {openPasswordModal && <ChangePassword close={setOpenPasswordModal} />}
    </>
    )
}

export default Nav