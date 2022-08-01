import React, { useState, useEffect} from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import axios from 'axios';
import { userContext } from './components/context/UserContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Style/main.scss';

function App() {
  const [userConnected, setUserConnected] = useState(false)
  const [refresh, setRefresh] = useState(true)
  const [user, setUser] = useState({name: "", firstname: "", id : "", admin: ""});
  // Instance d'axios pour ajouter les credentials et la base de l'URL automatiquement 
  const instance = axios.create( {withCredentials: true, baseURL: "http://localhost:3000" } );

  useEffect(() => {
    // Requete de contrôle utilisateur et de récuperation de données
    instance.get('/api/user/islogged')
    .then(res =>{ 
      if(res.data.user_id){
            instance.get('/api/user/getuser')
            .then(data => {
              // Si il y a une erreur
              if(data.error){
                setUserConnected(false)
                return console.log("pas autorisé");
              }
              // Insertion des données utilisateur récupéré
              const {name, firstname, id, isAdmin, url} = data.data[0];
              setUser({name, firstname, id, admin: isAdmin, url})
              setUserConnected(true)
            })
            .catch(error => setUserConnected(false))
      }
    })
    .catch(err => console.log(err))
  }, [userConnected, user.id, user.name, user.firstname, user.admin, refresh])
  
  return (
    <>
      <userContext.Provider value={{user, userConnected, setUserConnected, refresh, setRefresh, instance}} >
        <Routes>
          <Route path='/home' element={userConnected ? <Navigate to="/dashboard"  /> : <Home logged={setUserConnected}/>} />
          <Route path='/dashboard' element={userConnected ? <Dashboard /> : <Navigate to='/home' />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </userContext.Provider>
      <ToastContainer limit={3} />
    </>
  );
}

export default App;
