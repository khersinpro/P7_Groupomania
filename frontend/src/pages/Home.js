import React, {useState} from 'react';
import HomeNav from '../components/home/HomeNav';
import Login from '../components/home/Login';
import SignUp from '../components/home/SignUp';

const Home = ({logged}) => {
    // Ouverture de Login ou SignUp
    const [openLogin, setOpenLogin] = useState(true)

    return (
        <>
            <HomeNav logOrSign={setOpenLogin} />
            <main>
                <h1 id='title-home'>Bienvenue sur Groupomania</h1>
            {
                openLogin ?
                <Login logged={logged} />
                :
                <SignUp redirect={setOpenLogin} />
            }
            </main>
        </>
    )
}

export default Home