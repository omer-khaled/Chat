import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { actionwith } from '../context/context';
import { db } from '../firebase/firebase';

function Users() {
    let myuser = useSelector(state=>state.user);
    const [users,setUsers] = useState([]);
    const dispatch = useDispatch();
    useEffect(()=>{
        getData();
    },[]);
    const getData = async()=>{
        try{
            onSnapshot(collection(db,"users"),(snapShot)=>{
                let list = [];
                snapShot.docs.forEach(doc=>{
                    list.push({...doc.data(),id:doc.id})
                });
                setUsers([...list]);
            })
        }catch(e){
            console.log(e);
        }
    }
    const openwindo = async(forid)=>{
        const fetched = await getDoc(doc(db,"users",forid));
        dispatch(actionwith({...fetched.data(),id:fetched.id}));
    }
    return (
        <div className='allusers'>
            <div className='myinfo'>
                <img src={myuser.img} alt="personalImage"/>
                <div className='info'>
                    <p>{myuser.name}</p>
                </div>
            </div> 
            <div className='users'> 
                    {users.length!==0&&users.map((user)=>{
                        return((user.id!==myuser.id)&&
                            <div className='user-info' key={user.id} onClick={()=>{
                                openwindo(user.id);
                            }}>
                                <img src={user.img} alt="personalImage"/>
                                <div className='info'>
                                    <p>{user.name}</p>
                                </div>
                            </div>
                        )
                    })}
            </div>
        </div>
    )
}
export default Users;
