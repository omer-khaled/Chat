import { combineReducers, legacy_createStore } from "redux";

const reducer = (state={},action)=>{
    switch(action.type){
        case "add": 
            return {...(action.payload)}
        default:
            return {...state};
    }
}
const reducerchat = (state={},action)=>{
    switch(action.type){
        case "withadd": 
            return {...(action.payload)}
        default:
            return {...state};
    }
}

const combine = combineReducers({
    user:reducer,
    another:reducerchat
})
const store = legacy_createStore(combine);

const action = (user)=>{
    return{
        type:"add",
        payload:user,
    }
}
const actionwith = (user)=>{
    return{
        type:"withadd",
        payload:user,
    }
}

export {store,action,actionwith};
