import { Route, Routes } from 'react-router-dom';
import './App.css';
import Signin from './Components/User/Signin/Signin';
import Signup from './Components/User/Signup/Signup';
import Forget from './Components/User/Forget/Forget';
import Reset from './Components/User/Reset/Reset';
import Home from './Components/Home/Home';
import EditBio from './Components/EditBio/EditBio';
import { useState } from 'react';
import Error from './Components/Error';

function App() {

  return (
    <div className="App">
    <Routes>
    <Route exact path='/' element={<Signin/>}/>

    <Route exact path='/signup' element={<Signup/>}/>

    <Route exact path='/forgot' element={<Forget/>}/>

    <Route exact path='/reset-password/:id/:token' element={<Reset/>}/>

    <Route exact path='/home/:id' element={<Home/>}/>

    <Route exact path='/edit/:id' element={<EditBio/>}/>

    <Route exact path='*' element={<Error/>}/>


    </Routes>
    </div>
  );
}

export default App;
