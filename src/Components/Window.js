import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import {  db, storage } from '../firebase/firebase';

function Window() {
    const anotherUser = useSelector(state=>state.another);
    const myuser = useSelector(state=>state.user);
    const [data,setData] = useState({});
    const [upload,setUploade] = useState(true);
    const [massage,setMassage] = useState('');
    const [chats,SetChats] = useState(null);
    const messagesEndRef = useRef(null);
    useEffect(()=>{
        getChats();
    },[anotherUser.id]);
    useEffect(()=>{
        messagesEndRef.current?.scrollIntoView();
    },[chats]);
    const getChats = async()=>{
        if(anotherUser.id!==undefined){
            try{
                const q = query(collection(db, "chats"),where("sel","in",[`${myuser.id}${anotherUser.id}`,`${anotherUser.id}${myuser.id}`]),orderBy('timeStamp','asc'));
                onSnapshot(q, (querySnapshot) => {
                    const chating = [];
                    querySnapshot.forEach((doc) => {
                        chating.push({...doc.data(),id:doc.id});
                    });
                    SetChats([...chating]);
                });
            }catch(err){
                console.log(err);
            }
        }
    }
    const singupData = async(e)=>{
        e.preventDefault();
        try{
            if(data.img === undefined){
                await addDoc(collection(db,"chats"),{...data,timeStamp:serverTimestamp(),img:"",from:`${myuser.id}`,to:`${anotherUser.id}`,sel:`${myuser.id}${anotherUser.id}`});
            }else{
                await addDoc(collection(db,"chats"),{...data,timeStamp:serverTimestamp(),from:`${myuser.id}`,to:`${anotherUser.id}`,sel:`${myuser.id}${anotherUser.id}`});
            }
            setData({});
            setMassage('');
        }catch(err){
            console.log(err);
        }
    }
    const handleImage = async(file)=>{
        const displayNAme = new Date().getTime() + file.name;
        const storageRef  = ref(storage, displayNAme);
        const uploadTask  = uploadBytesResumable(storageRef, file);
        uploadTask.on('state_changed', 
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                    default:
                        break;
                }
            }, 
            (error) => {
                console.log(error);
            }, 
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setData({...data,img:`${downloadURL}`});
                    setUploade(true);
                });
            }
        );
    }
    return (
        <div className='window'>
            {(anotherUser.img!==undefined)&&
                <React.Fragment>
                    <div className='window-header'>
                            <img src={anotherUser.img} alt="personalImage"/>
                            <p>{anotherUser.name}</p>
                    </div>
                    <div className='window-body'>
                        {
                            (chats)?((chats.length===0)?<h1 className='handle-h1'>no message with this user</h1>:chats.map((doc,index)=>{
                                return ((doc.from===myuser.id)?
                                    <div className='fromme' key={doc.id}>
                                        <p>{doc.massage}</p>
                                        {(doc.img!=="")&&<img src={doc.img} alt='imagemassage'/>}
                                        {
                                            (doc.timeStamp)&&<p className='time'>{`${`${(doc.timeStamp).toDate().toLocaleTimeString().split(' ')[0].slice(0,-3)}`} ${(doc.timeStamp).toDate().toLocaleTimeString().split(' ')[1]}`}</p>
                                        }
                                    </div>:
                                    <div className='fromhe' key={doc.id}>
                                        <p>{doc.massage}</p>
                                        {(doc.img!=="")&&<img src={doc.img} alt='imagemassage'/>}
                                        {  
                                            (doc.timeStamp)&&<p className='time'>{`${`${(doc.timeStamp).toDate().toLocaleTimeString().split(' ')[0].slice(0,-3)}`} ${(doc.timeStamp).toDate().toLocaleTimeString().split(' ')[1]}`}</p>
                                        }
                                    </div>
                                )
                            })):<div className='empty'></div>
                        }
                        <div ref={messagesEndRef} />
                    </div>
                    <div className='form'>
                        <form onSubmit={(e)=>{
                            singupData(e);
                        }}>
                            <div className='input-control' >
                                <input type={"text"} value={massage} name="massage" placeholder='Enter your Massage' onChange={(e)=>{
                                    setMassage(e.target.value);
                                    setData({...data,massage:`${e.target.value}`});
                                }}/>
                                <div className='file'>
                                    <input type={"file"} name="userImage" onChange={(e)=>{
                                        let src = e.target.files[0];
                                        setUploade(false);
                                        handleImage(src);
                                    }}/>
                                    <i className="bi bi-cloud-plus-fill"></i>
                                </div>
                                <button type='submit' disabled={upload==true?false:true}>send</button>
                            </div>
                        </form>
                    </div>
                </React.Fragment>
            }
        </div>
    )
}
export default Window;