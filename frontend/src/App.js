import logo from './logo.svg';
import React,{createContext, useState} from 'react';
import './App.css';
import Navbar from './components/navbar';
import Signup from './components/signup';
import Signin from './components/signin';
import Profile from './screens/profile';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './screens/home';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Createpost from './screens/createpost';
import { LoginContext } from './context/LoginContext';
import Modal from './components/Modal';
import UserProfile from './components/UserProfile';
import MyFollowingPost from './screens/MyFollowingPost';

function App() {
  const [userLogin, setUserLogin] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <BrowserRouter> {/*routing using react router dom */}
    <div className="App">
      <LoginContext.Provider value={{ setUserLogin,setModalOpen }}>
      <Navbar login={userLogin} />
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/signup' element={<Signup/>}></Route>
        <Route path='/signin' element={<Signin/>}></Route>
        <Route exact path='/profile' element={<Profile/>}></Route>
        <Route path='/createpost' element={<Createpost/>}></Route>
        <Route path='/profile/:userid' element={<UserProfile/>}></Route>
        <Route path='/followingpost' element={<MyFollowingPost/>}></Route>
      </Routes>
      <ToastContainer theme='dark'/>

        {modalOpen && <Modal setModalOpen={setModalOpen}></Modal>}
      </LoginContext.Provider>
    </div>
    </BrowserRouter>
  );
}

export default App;
