import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {Link,Route} from 'react-router-dom'
import { currentAdmin } from '../../functions/auth';
import LoadingToRedirect from './LoadingToRedirect';


const AdminRoute=({children,...rest})=>{
    const {user}=useSelector((state)=>({...state}));
    const [ok,setOk]=useState(false);

    useEffect(()=>{
        if(user && user.token){
            currentAdmin(user.token)
            .then((res)=>{
                setOk(true);
            }).catch((err)=>{
                setOk(false);
            })
        } 
    },[user])

    return ok ? <Route {...rest} /> : <h1 className="text-danger"><LoadingToRedirect/></h1>

}


export default AdminRoute;