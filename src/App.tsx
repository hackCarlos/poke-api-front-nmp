import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Navigate, Routes } from "react-router";

import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Login></Login>} />
      <Route path="/register" element={<Register></Register>} /> 
      <Route path="/profile" element={<Profile></Profile>} />
    </Routes>
  </Router>
);

export default App;