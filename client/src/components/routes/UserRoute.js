import React from 'react';
import { useSelector } from 'react-redux';
import {Link,Route} from 'react-router-dom'
import LoadingToRedirect from './LoadingToRedirect';


const UserRoute=({children,...rest})=>{
    const {user}=useSelector((state)=>({...state}));

    return user && user.token ? <Route {...rest} /> :<h1 className="text-danger"><LoadingToRedirect/></h1>

}

export default UserRoute;