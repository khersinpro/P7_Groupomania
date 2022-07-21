import React, {useState, useContext} from 'react'
import axios from 'axios'
import dayjs from 'dayjs';
import { userContext } from '../../../../context/UserContext';

const DisplayCom = ({com, post}) => {
    const [newCom, setNewCom] = useState("");
    const {user, refresh, setRefresh} = useContext(userContext);
    // Fonction pour envoyer un nouveau commentaire
    const sendCom = (e) => {
        e.preventDefault();
        if(newCom){
            axios({
                method: 'post',
                url: 'http://localhost:3000/api/comment/create',
                withCredentials: true,
                data:{
                    post_id: post, 
                    comment: newCom,
                    date: dayjs(new Date()).format('DD/MM/YYYY HH:mm'),
                    user_id: user.id
                }
            })
            .then(() => setRefresh(!refresh))
            .catch(error => console.log(error))
            setNewCom("")
        }else{
            console.log("pas de commentaire");
        }
    }
    // Fonction de suppression d'un commentaire
    const deleteCom = (id) => {
        axios({
            method: 'delete',
            url: "http://localhost:3000/api/comment/delete",
            withCredentials: true,
            data: {user_id: user.id, id}
        })
        .then(() => setRefresh(!refresh))
        .catch(error => console.log(error))
    }

    // permet de filtrer les resultats voulu puis de les afficher grace a map   
    const comMap = com.filter(com => com.post_id === post).map(res => (
            <div key={res.id}> 
                <div className='com'>
                    <div className='com--avatar'>
                        <img src={`http://localhost:3000/images/avatar/${res.url}`} alt='photo de profil'  />
                    </div>
                    <div className='com--text'>
                        <h4>{res.firstname + " " + res.name}</h4>
                        <p className='com--text__date'>Le {res.date}</p>
                        <p className='com--text__message'>{res.comment}</p>
                    </div> 
                    <div className='com--deleteCom' onClick={() => deleteCom(res.id)}>
                        <i className="fa-solid fa-xmark"></i>
                    </div>
                </div>
            </div>
    ))

    return (
        <>
        <div className='post--comContainer'>
            {comMap.length > 0 && comMap }
            {comMap.length > 0 && <hr className='post--hrSmall'></hr>}
        </div>
        <form onSubmit={sendCom}>
            <input type='test' placeholder='Nouveau commentaire' value={newCom} onChange={e => setNewCom(e.target.value)} />
        </form>
    </>
    )
}

export default DisplayCom