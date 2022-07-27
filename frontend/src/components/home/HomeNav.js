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
            <div className="btn-rond-menu" onClick={() => setBurgerMenu(!burgerMenu)}>
                <div className={`cont-ligne ${burgerMenu ? "active" : ""}`}>
                    <div className="ligne-unique"></div>
                </div>
            </div>
            <nav className={`dashNav ${burgerMenu ? "openNav" : ""}`}>
                <div className='dashNav--firstBloc'>
                    <img className='dashNav--firstBloc__logo' src={logo} alt='groupomania logo' />
                    <button onClick={() => {setBurgerMenu(false); logOrSign(true)}}><i className="fa-solid fa-right-to-bracket"></i>Connexion</button>
                    <button onClick={() => {setBurgerMenu(false); logOrSign(false)}}><i className="fa-solid fa-user-plus"></i>Création de compte</button>
                </div>
            </nav>

        </header>
    )
}

export default HomeNav