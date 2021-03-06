import React, { useState, useEffect} from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import axios from 'axios';
import { userContext } from './components/context/UserContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Style/main.scss';

function App() {
  const [userConnected, setUserConnected] = useState(false)
  const [refresh, setRefresh] = useState(true)
  const [user, setUser] = useState({name: "", firstname: "", id : "", admin: ""});
  // Instance d'axios pour ajouter les credentials automatiquement
  const instance = axios.create( {withCredentials: true} );

  useEffect(() => {
    // Requete de contrôle utilisateur et de récuperation de données
    instance.get('http://localhost:3000/api/user/getuser')
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
    .catch(error => {
      setUserConnected(false)
      console.log(error);
    })
  }, [userConnected, user.id, user.name, user.firstname, user.admin, refresh])
  
  return (
    <>
      <userContext.Provider value={{user, userConnected, setUserConnected, refresh, setRefresh}} >
        <Routes>
          <Route path='/home' element={userConnected ? <Navigate to="/dashboard"  /> : <Home logged={setUserConnected}/>} />
          <Route path='/dashboard' element={userConnected ? <Dashboard /> : <Navigate to='/home' />} />
        </Routes>
      </userContext.Provider>
      <ToastContainer limit={2} />
    </>
  );
}

export default App;
