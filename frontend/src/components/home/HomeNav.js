import React, {useState} from 'react'
import logo from '../../assets/Groupomania+Logos/Groupomania Logos (update 2022)/icon-left-font-monochrome-white.png'
import headerLogo from '../../assets/Groupomania+Logos/Groupomania Logos (update 2022)/icon-left-font-monochrome-black.png'

const HomeNav = ({logOrSign}) => {
    // State d'ouverture du menu
    const [burgerMenu, setBurgerMenu] = useState(false)
       // Fonction buger menu
       window.addEventListener('resize', () => burgerMenu && setBurgerMenu(false))
    return (
        <header className='dashboard--header'>
            <img id='headerLogo' src={headerLogo} alt='groupomania logo' />

            <button className="btn-rond-menu" onClick={() => setBurgerMenu(!burgerMenu)} 
                type="button" aria-haspopup='menu' title='Ouvrir le menu'
            >
                <div className={`cont-ligne ${burgerMenu ? "active" : ""}`}>
                    <div className="ligne-unique"></div>
                </div>
            </button>

            <nav aria-label='Menu principal' className={`dashNav ${burgerMenu ? "openNav" : ""}`} >
                <div className='dashNav--firstBloc'>
                    <img className='dashNav--firstBloc__logo' src={logo} alt='Logo de Groupomania' />

                    <button className="navButton" onClick={() => {setBurgerMenu(false); logOrSign(true)}} type="button" aria-label='Ouvrir la page de connexion'>
                        <i className="fa-solid fa-right-to-bracket"></i>Connexion
                    </button>

                    <button className="navButton" onClick={() => {setBurgerMenu(false); logOrSign(false)}} type="button" aria-label="Ouvrir la page d'inscription">
                        <i className="fa-solid fa-user-plus"></i>Création de compte
                    </button>
                </div>
            </nav>

        </header>
    )
}

export default HomeNav