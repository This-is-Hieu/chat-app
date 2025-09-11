import React, { useEffect } from 'react'

import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import SettingPage from './pages/SettingsPage';
import SignUpPage from './pages/SignUpPage';
import {Loader} from "lucide-react";

import { useAuthStore} from "./store/useAuthStore"
import {Routes,Route,Navigate} from "react-router-dom"
const App = () => {
  const {authUser,checkAuth,isCheckingAuth} = useAuthStore();
  
  useEffect (() => {
    checkAuth()
  }, [checkAuth]);

  console.log({authUser});

  if(isCheckingAuth && !authUser)
    return (
        <div className = "flex items-center justify-center h-screen">
          <Loader className="size-10 animate-spin" />
        </div>
    )


  return (
  <div>  
    <Navbar />
    <Routes>
      <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} /> 
      <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} /> 
      <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to= "/"/>} /> 
      <Route path="/setting" element={<SettingPage />} /> 
      <Route path="/profile" element={ authUser ? <ProfilePage /> : <Navigate to="/login"/>} /> 
    </Routes>
      
  </div>
  );
};

export default App