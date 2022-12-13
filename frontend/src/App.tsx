import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Buyer from './pages/Buyer';
import Login from './pages/Login';
import PageTemplate from './pages/PageTemplate';
import Register from './pages/Register';
import Seller from './pages/Seller';

function App() {
  return (
    <Routes>
      <Route path='/' element={<PageTemplate />}>
        <Route index path='login' element={<Login />} />
        <Route path='register' element={<Register />} />
        <Route path='seller' element={<Seller />} />
        <Route path='seller' element={<Buyer />} />
      </Route>
    </Routes>
  );
}

export default App;
