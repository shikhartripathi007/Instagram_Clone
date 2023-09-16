import React,{useState,useEffect} from 'react'
import "../css/createpost.css";
import {toast} from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function Createpost() {
const [body, setBody] = useState("");
const [image, setImage] = useState("")
const [url, setUrl] = useState("")
const navigate = useNavigate()

// Toast functions
const notifyA = (msg)=> toast.error(msg)
const notifyB = (msg)=> toast.success(msg)


useEffect(() => {
  //saving post to mongodb
  if(url){
    fetch("/createPost",{
    method:"post",
    headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer " + localStorage.getItem("jwt")
    },
    body:JSON.stringify({
        body,
        pic:url
    })
    }).then(res=>res.json())
    .then(data=>{if(data.error){
        notifyA(data.error)
    }else{
        notifyB("Successfully Posted!")
        navigate("/")
    }})
    .catch(err => console.log(err))
  }
  
}, [url])


    //posting image to cloudinary
    const postDetails = ()=>{
        console.log(body, image)
        const data = new FormData()
        data.append("file",image)
        data.append("upload_preset", "insta-clone")
        data.append("cloud_name", "mycloud-007")
        fetch("https://api.cloudinary.com/v1_1/mycloud-007/image/upload",
        {
            method:"post",
            body:data
        }).then(res=>res.json())
        .then(data => setUrl(data.url))
        .catch(err => console.log(err))

    }




    const loadfile = (event)=>{
        var output = document.getElementById('output');
        output.src = URL.createObjectURL(event.target.files[0]);
        output.onload = function() {
        URL.revokeObjectURL(output.src)
        }
    }
  return (
    <div className='createPost'>
        {/* Header */}
        <div className="post-header">
            <h4 style={{margin:"3px auto"}}>Create new post</h4>
            <button id='post-btn' onClick={()=>{postDetails()}}>Share</button>
        </div>
        {/* Image preview */}
        <div className="main-div">
            <img id="output" src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-512.png"/>
            <input type="file" accept="image/*" onChange={(event)=>{loadfile(event); setImage(event.target.files[0])}} />
        </div>
        {/* details */}
        <div className="details">
            <div className="card-header">
                <div className="card-pic">
                    <img src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c3F1YXJlJTIwcHJvZmlsZSUyMHBpY3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=400&q=60" alt="" />
                </div>
                <h5>Infinity_007</h5>
            </div>
            <textarea value={body} onChange={(e)=>{
                setBody(e.target.value)
            }} type="text" placeholder='Write a caption...'></textarea>
        </div>
    </div>
  )
}
