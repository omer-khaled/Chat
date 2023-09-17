import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/firebase';

function Login() {
    const [data,setData] = useState({});
    const [error,setError] = useState('');
    const navigator = useNavigate();
    const singupData = async(e)=>{
        e.preventDefault();
        try{
            const res = await signInWithEmailAndPassword(auth,data.email,data.password);
            const id = res.user.uid;
            const docSnap =  await getDoc(doc(db,'users',id));
            if(docSnap.exists()){
                localStorage.setItem('user',JSON.stringify({...docSnap.data(),id:id}));
            }
            navigator('/Chat/home');
        }catch(err){
            setError(err.message);
        }
    }
    return (
        <div className='form'>
            <form onSubmit={(e)=>{
                singupData(e);
            }}>
                <p className='form-head'>Omer Chat</p>
                <p className='form-name'>Login</p>
                <div className='input-control'>
                    <input type={"email"} name="userEmail" placeholder='Enter Email'onChange={(e)=>{
                        setData({...data,email:`${e.target.value}`});
                    }}/>
                </div>
                <div className='input-control'>
                    <input type={"password"} name="userpassword" placeholder='Enter Password'onChange={(e)=>{
                        setData({...data,password:`${e.target.value}`});
                    }}/>
                </div>
                {(error!=='')?<p className='danger'>{error}</p>:<React.Fragment></React.Fragment>}
                <button type='submit'>Log in</button>
                <p className='alert'>You have not Account <Link to="/Chat/">Singup</Link></p>
            </form>
        </div>
    )
}
export default Login;
