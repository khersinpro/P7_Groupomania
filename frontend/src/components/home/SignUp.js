import React, {useState} from 'react'
import { toast } from 'react-toastify';
import axios from 'axios';

const SignUp = () => {
    const [name, setName] = useState();
    const [firstname, setFirstname] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    // Instance d'axios pour ajouter les credentials et la base de l'URL automatiquement 
    const instance = axios.create( {withCredentials: true, baseURL: "http://localhost:3000" } );
    //*** numeric and letter _ . - + numeric and letters min 2 max 10 + letters min 2 max 5 ***/
    const emailReg = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    //*** Minimum 12 characters, at least one uppercase letter, one lowercase letter, one number and one special character ***/
    const passwordReg = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-+])(?=\\S+$).{12,}$";
    //***Doit contenir 1 lettre mini, peut contenir -/ /' ***/
    const nameReg = "^[a-zA-Zéèàîïùâ]+(([' -][a-zA-Z])?[a-zA-Zéèàîïùâ]*)*$";

    const sendData = (e) => {
        e.preventDefault();
        if(email.match(emailReg) && password.match(passwordReg) && name.match(nameReg) && firstname.match(nameReg) ){
            instance.post('/api/user/createuser', {name, firstname, email,password})
            .then(data => console.log("RAS"))
            .then(() => toast.success("Compte crée !", {autoClose: 2000}))
            .catch(error => toast.warn("Une erreur est survenue ...", {autoClose: 2000}))
        }else{
            toast.warn("Le formulaire est mal remplis ...", {autoClose: 2000})
        }
    }

    return (
        <div className='homeBox'> 
        <h2>
            <i className="fa-solid fa-user-plus"></i>
            Création de compte
        </h2>

        <form className='homeBox--form' onSubmit={sendData} >

            <div className='homeBox--form__inputBox'>
                <label htmlFor='name'>Nom</label>
                <input onChange={e => setName(e.target.value)} id='name'type="text"  placeholder='Entrez votre nom'/>
                {name && !name.match(nameReg) &&
                    <p className='home--error'>
                        <i className="fa-solid fa-triangle-exclamation"></i>
                        Ce format de nom est incorrect ...
                    </p>
                }
            </div>

            <div className='homeBox--form__inputBox'>
                <label htmlFor='firstname'>Prénom</label>
                <input onChange={e => setFirstname(e.target.value)} id='firstname' type="text" placeholder='Entrez votre prénom' />
                {firstname&& !firstname.match(nameReg) &&
                    <p className='home--error'>
                        <i className="fa-solid fa-triangle-exclamation"></i>
                        Ce format de prénom est incorrect ...
                    </p>
                }
            </div>
            
            <div className='homeBox--form__inputBox'>
                <label htmlFor='email'>Adresse Email :</label>
                <input onChange={e => setEmail(e.target.value) }  id="email" type='email' placeholder='Email' />
                {email && !email.match(emailReg) &&
                    <p className='home--error'>
                        <i className="fa-solid fa-triangle-exclamation"></i>
                        E-mail incorrect...
                    </p>
                }
            </div>

            <div className='homeBox--form__inputBox'>
                <label htmlFor='password'>Mot de passe :</label>        
                <input onChange={e => setPassword(e.target.value)} id='password' type='password' placeholder='Mot de passe' />
                { password && !password.match(passwordReg) && 
                    <p className='home--error'>
                        <i className="fa-solid fa-triangle-exclamation"></i>
                        Le mot de passe doit contenir 12 caractères et au minimum une majuscule, une minuscule, un caractère spécial et un chiffre.
                    </p>
                }
            </div>

            <input type='submit' value="Connexion" />
        </form>
    </div>
    )
}

export default SignUp