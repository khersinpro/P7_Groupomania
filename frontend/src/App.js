import React, { useState, useEffect, createContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import axios from 'axios';
import { userContext } from './components/context/UserContext';
import './App.css';

function App() {
  const [userConnected, setUserConnected] = useState(false)
  const [user, setUser] = useState({name: "", firstname: "", id : "", admin: ""});

  useEffect(() => {
    // Requete de contrôle utilisateur et de récuperation de données
    axios({
      method: "get",
      url: 'http://localhost:3000/api/user/getuser',
      withCredentials: true
    })
    .then(data => {
      // Si il y a une erreur
      if(data.error){
        setUserConnected(false)
        return console.log("pas autorisé");
      }
      // Insertion des données utilisateur récupéré
      const {name, firstname, id, isAdmin} = data.data[0];
      setUser({name, firstname, id, admin: isAdmin})
      setUserConnected(true)
    })
    .catch(error => {
      setUserConnected(false)
      console.log(error);
    })
  }, [userConnected, user.id, user.name, user.firstname, user.admin])
  
  return (
    <>
      <userContext.Provider value={{user, userConnected, setUserConnected}} >
        <Routes>
          <Route path='/home' element={userConnected ? <Navigate to="/dashboard"  /> : <Home logged={setUserConnected}/>} />
          <Route path='/dashboard' element={userConnected ? <Dashboard /> : <Navigate to='/home' />} />
        </Routes>
      </userContext.Provider>
    </>
  );
}

export default App;
