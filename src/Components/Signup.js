import { auth , db , storage } from '../firebase/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc,doc, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

function Signup() {
    const [data,setData] = useState({});
    const [file,setFile] = useState('');
    const [error,setError] = useState('');
    const navigator = useNavigate();
    const [progress,setProgress] = useState(null);
    const singupData = async(e)=>{
        e.preventDefault();
        try{
            const res = await createUserWithEmailAndPassword(auth,data.email,data.password);
            const id = res.user.uid;
            if(data.img === undefined){
                await setDoc(doc(db,"users",id),{...data,timeStamp:serverTimestamp(),img:"https://firebasestorage.googleapis.com/v0/b/chat-e267f.appspot.com/o/download%20(1).jpeg?alt=media&token=00cfb47f-775e-40ad-82f0-5fbce61c85d0"});
            }else{
                await setDoc(doc(db,"users",id),{...data,timeStamp:serverTimestamp()});
            }
            navigator('/Chat/login');
        }catch(err){
            setError(err.message);
        }
    }
    const handleImage = async(file)=>{
        const displayNAme = new Date().getTime() + file.name;
        const storageRef  = ref(storage, displayNAme);
        const uploadTask  = uploadBytesResumable(storageRef, file);
        uploadTask.on('state_changed', 
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(Number(progress));
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
                });
            }
        );
    }
    return (
        <div className='form'>
            <form onSubmit={(e)=>{
                singupData(e);
            }}>
                <p className='form-head'>Omer Chat</p>
                <p className='form-name'>Signup</p>
                <div className='input-control' >
                    <input type={"text"} name="userName" placeholder='Enter Name' onChange={(e)=>{
                        setData({...data,name:`${e.target.value}`});
                    }}/>
                </div>
                <div className='input-control'>
                    <input type={"email"} name="userEmail" placeholder='Enter Email'onChange={(e)=>{
                        setData({...data,email:`${e.target.value}`});
                    }}/>
                </div>
                {(error!=='')?<p className='danger'>{error}</p>:<React.Fragment></React.Fragment>}
                <div className='input-control'>
                    <input type={"password"} name="userpassword" placeholder='Enter Password'onChange={(e)=>{
                        setData({...data,password:`${e.target.value}`});
                    }}/>
                </div>
                <div className='input-control'>
                    <input type={"file"} name="userImage" onChange={(e)=>{
                        let src = e.target.files[0];
                        setFile(URL.createObjectURL(src));
                        handleImage(src);
                    }}/>
                    <div>
                        <img src={file?file:"https://firebasestorage.googleapis.com/v0/b/chat-e267f.appspot.com/o/download%20(1).jpeg?alt=media&token=00cfb47f-775e-40ad-82f0-5fbce61c85d0"} alt="personalImage"/>
                        <span><i className="bi bi-cloud-plus-fill"></i>
                        Upload Image</span>
                    </div>
                </div>
                <button type='submit' disabled={(progress<100 && progress!==null)&&true}>Sign up</button>
                <p className='alert'>You already have account <Link to="/Chat/login">Login</Link></p>
            </form>
        </div>
    )
}
export default Signup;