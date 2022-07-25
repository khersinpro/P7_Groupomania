import React from 'react'
import logo from '../../assets/Groupomania+Logos/Groupomania Logos (update 2022)/icon-left-font-monochrome-white.png'

const HomeNav = ({logOrSign}) => {
    return (
        <header className='dashboard--header'>

            <nav className='dashNav'>
                <div className='dashNav--firstBloc'>
                    <img className='dashNav--firstBloc__logo' src={logo} alt='groupomania logo' />
                    <button onClick={() => logOrSign(true)}><i className="fa-solid fa-right-to-bracket"></i>Connexion</button>
                    <button onClick={() => logOrSign(false)}><i className="fa-solid fa-user-plus"></i>Création de compte</button>
                </div>
            </nav>

        </header>
    )
}

export default HomeNav