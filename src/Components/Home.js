import React, { useEffect } from 'react'
import Users from './Users';
import { useDispatch } from 'react-redux'
import { action } from '../context/context';
import Window from './Window';
function Home() {
    let dispatch = useDispatch();
    useEffect(()=>{
        dispatch(action(JSON.parse(localStorage.getItem('user'))));
    },[dispatch])
    return (
            <div className='home'>
                <Users />
                <Window />
            </div>
    )
}
export default Home;