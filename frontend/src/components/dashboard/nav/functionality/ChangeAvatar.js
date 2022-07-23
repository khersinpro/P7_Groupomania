import React, {useState, useContext} from 'react'
import { userContext } from '../../../context/UserContext'
import axios from 'axios'

const ChangeAvatar = ({close}) => {
    const [avatar, setAvatar] = useState();
    const {user, refresh, setRefresh} = useContext(userContext);
    // Fonction de changement d'avatar
    const changeAvatar = (e) => {
        e.preventDefault();
        if(avatar){
            const data = new FormData();
            data.append("image", avatar);
            data.append('user_id', user.id)
            axios({
                method: 'post',
                url: "http://localhost:3000/api/user/changeavatar",
                withCredentials: true,
                data
            })
            .then(() => {
                setRefresh(!refresh)
            })
            .catch(error => console.log(error))
        }
    }
    return (
        <div className='modifyAvatar' onSubmit={changeAvatar}>
            <form className='modifyAvatar--form'>
                <h3>Modification d'avatar</h3>
                <label>Ajouter une image</label>
                <input type="file" id='imageInput' accept="image/png, image/jpeg, image/jpg, image/gif" onChange={e => setAvatar(e.target.files[0])} />
                <input type="submit" />
            </form>
        </div>
    )
}

export default ChangeAvatar