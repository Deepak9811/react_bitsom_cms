import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const useAuth = ()=>{
    if(localStorage.getItem("isLogged")){
        const user = {loggedIN :true};
        return user && user.loggedIN
    }else{
        const user = {loggedIN :false};
        return user && user.loggedIN
    }
    
    // return user && user.loggedIN
}

const Protected = () => {
    const isAuth = useAuth();
    return isAuth ? <Outlet/>:<Navigate to={"/login"}/>
}

export default Protected