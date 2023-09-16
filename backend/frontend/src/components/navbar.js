import React,{useContext} from "react";
import logo from "../img/logo.png"
import "../css/navbar.css"
import { Link  } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";
import { useNavigate } from "react-router-dom";

export default function Navbar({login}) {
    const navigate = useNavigate()
    const {setModalOpen} = useContext(LoginContext)
    const loginStatus = ()=>{
        const token =localStorage.getItem("jwt")
        if(login || token){
            return [
                <>
                <Link to="/profile">
                    <li>Profile</li>
                </Link>
                
                <Link to="/createPost"><li>Create</li>
                
                </Link>
                <Link to="/followingpost"><li>My Following</li>
                
                </Link>
                <Link to={""}>
                    <button className="primaryBtn" onClick={()=> setModalOpen(true)}>Log Out</button>
                </Link>
                </>
            ]
        }else{
            return [
                <>
                <Link to="/signup">
                    <li>Sign up</li>
                </Link>

                <Link to="/signin">
                    <li>Log in</li>
                </Link>
                </>
            ]
        }
    };

    const loginStatusMobille = ()=>{
        const token =localStorage.getItem("jwt")
        if(login || token){
            return [
                <>
                <Link to="/">
                    <li><span class="material-symbols-outlined">home</span></li>
                </Link>
                <Link to="/profile">
                    <li><span class="material-symbols-outlined">account_circle</span></li>
                </Link>
                
                <Link to="/createPost"><li><span class="material-symbols-outlined">add_box</span></li>
                
                </Link>
                <Link to="/followingpost"><li><span class="material-symbols-outlined">explore</span></li>
                
                </Link>
                <Link to={""}>
                    <li onClick={()=> setModalOpen(true)}><span class="material-symbols-outlined">logout</span></li>
                </Link>
                </>
            ]
        }else{
            return [
                <>
                <Link to="/signup">
                    <li>Sign up</li>
                </Link>

                <Link to="/signin">
                    <li>Log in</li>
                </Link>
                </>
            ]
        }
    };
    

    return (
        <div className="navbar">
            <img id="insta-logo" src={logo} onClick={()=>{navigate("/")}}></img>
            <ul className="nav-menu">
               {loginStatus()} 
            </ul>
            <ul className="nav-mobile">
               {loginStatusMobille()} 
            </ul>
        </div>
    )
}
