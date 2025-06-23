// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./components/Home";
import PostCreate from "./components/PostCreate";
import PostDetail from "./components/PostDetail";
import ProfilePage from "./components/ProfileDetail";

import "./App.css"; 
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function App() {
  return (
    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create" element={<PostCreate />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        
      </Routes>
       <ToastContainer position="top-center" theme="colored" autoClose={3000} />
    </BrowserRouter>
    

  );
}
