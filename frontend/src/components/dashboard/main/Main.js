import React, {useContext, useState, useEffect} from 'react'
import { userContext } from '../../context/UserContext'
import { postContext } from '../../context/PostContext'
import DisplayAllPosts from './allpost/DisplayAllPost'
import NewPost from './newpost/NewPost'
import axios from 'axios'

const Main = () => {
  // Importation des données USER avec le useContext
  const {user} = useContext(userContext);
  // Création du state contenant tout les POSTS
  const [allPosts, setAllPosts] = useState([]);
  // Instance d'axios pour ajouter les credentials et la base de l'URL automatiquement 
  const instance = axios.create( {withCredentials: true, baseURL: "http://localhost:3000" } );

  // Fonction de récupération de tout les POSTS
  const getAllPosts = () => {
      instance.get(`/api/post/getall/${user.id}`)
      .then(res => setAllPosts(res.data))
      .catch(error => console.log(error))
  }

  // Récupération de tout les POST quand un user est connecté
  useEffect(() => {
    user.id !== "" && getAllPosts();
  }, [user])

  return (
    <postContext.Provider value={{getAllPosts, allPosts}} >
      <main>
        <NewPost />
        <DisplayAllPosts />
      </main>
    </postContext.Provider>
  )
}

export default Main