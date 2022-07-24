import React, {useState} from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';


const Home = ({logged}) => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const fetchData = (e) => {
        e.preventDefault();
        axios({
            method:'post',
            url: "http://localhost:3000/api/user/connexion",
            withCredentials: true,
            data: {
                email,
                password
            }
        })
        .then(data => logged(true))
        .then(() => toast.success("Bienvenue !", {autoClose: 2000}))
        .catch(error => toast.warn("Une erreur est survenue ...", {autoClose: 2000}))
    }
    return (
        <div>
            <h1>Home</h1>
            <form onSubmit={fetchData}>
                <label htmlFor='name'>email</label>
                <input id="name" type='email' onChange={e => setEmail(e.target.value)}/>
                <label htmlFor='password'>Password</label>
                <input id='password' type='password' onChange={e => setPassword(e.target.value)}/>
                <input type='submit' value="Envoyer" />
            </form>
        </div>
  )
}

export default Home