import React , { useEffect, useState } from 'react';
import {auth} from '../../firebase';
import {toast } from 'react-toastify';
import {useDispatch,useSelector} from 'react-redux';


const Register=({history})=>{

    const [email,setEmail]=useState('');
    const {user}=useSelector((state)=>({...state}));

    useEffect(() => {
        if(user && user.token) history.push("/");
        
    }, [user,history])

    const handleSubmit=async(e)=>{
        e.preventDefault();
        const config={
            url:process.env.REACT_APP_REGISTER_REDIRECT_URL,
            handleCodeInApp:true
        }
        await auth.sendSignInLinkToEmail(email,config);
        toast.success(`Email is sent to ${email}`);

        //save email in local storage
        window.localStorage.setItem("emailForRegistration",email);

        setEmail("");
    }

    const registerForm=()=>(
        <form onSubmit={handleSubmit}>        
        <input
        type="email"
        className="form-control"
        value={email}
        onChange={(e)=> setEmail(e.target.value)}
        autoFocus
        placeholder="Enter valid google email"

      />
      <br/>
      <button type="submit" className="btn btn-raised">
        Register
      </button>
        </form>
    
    )
    return(
        <div className="container p-5">
        <div className="row">
         <div className="col-md-6 offset-md-3">
         <h4>Register</h4>
         <h6>Enter your email we will send you confirmation</h6>
   
         {registerForm()}
         </div>
        </div>
       </div>
    )
}
export default Register;