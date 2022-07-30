import React, {useContext, useState} from 'react'
import { userContext } from '../../context/UserContext'
import headerLogo from '../../../assets/Groupomania+Logos/Groupomania Logos (update 2022)/icon-left-font-monochrome-black.png'
import navLogo from '../../../assets/Groupomania+Logos/Groupomania Logos (update 2022)/icon-left-font-monochrome-white.png'
import ChangeAvatar from './functionality/ChangeAvatar'
import ChangePassword from './functionality/ChangePassword'
import { toast } from 'react-toastify'

const Nav = () => {
    // Récupération des données utilisateur
    const {user, setUserConnected, instance} = useContext(userContext);
    // State pour l'ouverture/fermeture du modal du changement d'avatar
    const [openAvatar, setOpenAvatar] = useState(false)
    // State d'ouverture du menu
    const [burgerMenu, setBurgerMenu] = useState(false)
    // State pour l'ouverture/fermeture du modal de changement de mot de passe
    const [openPasswordModal, setOpenPasswordModal] = useState(false)

    // Fonction de deconnexion
    const logout = () => {
        instance.get(`/api/user/logout/${user.id}`)
        .then(() => setUserConnected(false))
        .then(() => window.location.reload())
        .catch(error => toast.warn('Une erreur est survenue ...', {autoClose: 2000}))
    }

    // Fonction buger menu
    window.addEventListener('resize', () =>
        burgerMenu && setBurgerMenu(false)
    )

    return (
    <>
        <header className='dashboard--header'>
            <img id='headerLogo' src={headerLogo} alt='Logo de Groupomania' />

            <button tabIndex="1"  className="btn-rond-menu" onClick={() => setBurgerMenu(!burgerMenu)} type="button" aria-haspopup='menu' title='Ouvrir le menu'>
                <div className={`cont-ligne ${burgerMenu ? "active" : ""}`}>
                    <div className="ligne-unique"></div>
                </div>
            </button>

            <nav aria-label='Menu principal' className={`dashNav ${burgerMenu ? "openNav" : ""}`}>
                <div className='dashNav--firstBloc'>
                    <img className='dashNav--firstBloc__logo' src={navLogo} alt='Logo de Groupomania' />

                    <div className='dashNav--firstBloc__userInfo' >
                        <div className='avatar'>
                            {user.url && <img src={`http://localhost:3000/images/avatar/${user.url}`} alt="Photo de profil de la barre de navigation"/>}
                        </div>
                        <h2>{user.name + " " + user.firstname}</h2>
                    </div>

                    {/* Bouton d'ouverture du modal de changement d'avatar d'utilisateur */}
                    <button tabIndex="2" onClick={() => {setBurgerMenu(false); setOpenAvatar(true)}} className="navButton firstBloc--navBtn"
                        type="button" aria-haspopup='true' aria-label="Ouvre la modification d'avatar" 
                    >
                        <i className="fa-solid fa-camera"></i> Changement d'avatar
                    </button>

                    {/* Bouton d'ouverture du modal de changement de mot de passe */}
                    <button tabIndex="6" onClick={() => {setBurgerMenu(false); setOpenPasswordModal(true)}} className="navButton firstBloc--navBtn"
                        type="button" aria-haspopup='true' aria-label="Ouvre la modification de mot de passe" 
                    >
                        <i className="fa-solid fa-lock"></i> Changement de mot de passe
                    </button>
                </div>

                <div className='dashNav--secondBloc' onBlur={() => setBurgerMenu(false)}>
                    <button onClick={logout} type="button" className="navButton"><i className="fa-solid fa-right-from-bracket"></i> Deconnexion</button>
                </div>
            </nav>

            {/* Modal pour le changement d'avatar d'utilisateur  */}
            {openAvatar && <ChangeAvatar close={setOpenAvatar} />}
            {/* Modal de changement de mot de passe */}
            {openPasswordModal && <ChangePassword close={setOpenPasswordModal} />}
        </header>
    </>
    )
}

export default Nav