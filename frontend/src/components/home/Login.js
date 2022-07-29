import React, {useState} from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = ({logged}) => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    // Instance d'axios pour ajouter les credentials et la base de l'URL automatiquement 
    const instance = axios.create( {withCredentials: true, baseURL: "http://localhost:3000" } );
    //*** numeric and letter _ . - + numeric and letters min 2 max 10 + letters min 2 max 5 ***/
    const emailReg = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/g;
    //*** Minimum 12 characters, at least one uppercase letter, one lowercase letter, one number and one special character ***/
    const passwordReg = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-+])(?=\\S+$).{12,}$";

    const sendData = (e) => {
        e.preventDefault();
        //email.match(emailReg) && password.match(passwordReg)
        if(email && password){
            instance.post('/api/user/connexion', {email,password})
            .then(data => logged(true))
            .then(() => toast.success("Bienvenue !", {autoClose: 2000}))
            .catch(error => toast.warn("Une erreur est survenue ...", {autoClose: 2000}))
        }else{
            toast.warn("Le formulaire est mal remplis ...", {autoClose: 2000})
        }
    }
    
    return (
        <div className='homeBox box-style'> 
            <h2>
            <i className="fa-solid fa-right-to-bracket"></i>
                Connexion
            </h2>

            <form className='homeBox--form' onSubmit={sendData}>
                <div className='homeBox--form__inputBox'>
                    <label htmlFor='email'>Adresse Email :</label>
                    <input id="email" placeholder='Email' type='email' onChange={e => setEmail(e.target.value)} aria-required="true"/>
                    {email && !email.match(emailReg) &&
                        <p className='home--error'>
                            <i className="fa-solid fa-triangle-exclamation"></i> 
                            E-mail incorrect...
                        </p>
                    }
                </div>

                <div className='homeBox--form__inputBox'>
                    <label htmlFor='password'>Mot de passe :</label>
                    <input id='password' placeholder='Mot de passe' type='password' onChange={e => setPassword(e.target.value)} aria-required="true"/>
                    {password && !password.match(passwordReg) &&
                        <p className='home--error'>
                            <i className="fa-solid fa-triangle-exclamation">
                            </i>Le mot de passe doit contenir 12 caractères et au minimum une majuscule, une minuscule, un caractère spécial et un chiffre.
                        </p>
                    }
                </div>

                <input className='button-style' type='submit' value="Connexion" />
            </form>
        </div>
    )
}

export default Login