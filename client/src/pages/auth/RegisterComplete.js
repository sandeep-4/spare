import React , { useEffect, useState } from 'react';
import {auth} from '../../firebase';
import {toast } from 'react-toastify';
import {useDispatch,useSelector} from 'react-redux';
import {createOrUpdateUser} from '../../functions/auth';

const RegisterComplete=({history})=>{

  let dispatch = useDispatch()


    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');

    useEffect(()=>{
        setEmail(window.localStorage.getItem('emailForRegistration'));
    },[history])
    const handleSubmit=async(e)=>{
        e.preventDefault();

        //validatuin
        if(!email || !password){
          toast.error('email and password is required');
          return;
        }

        if(password.length <8){
          toast.error('password must be greater tha 7 or min 8');
          return;
        }

        try {
          const result=await auth.signInWithEmailLink(email,window.location.href);
          if(result.user.emailVerified){
            window.localStorage.removeItem('emailForRegistration');

            let user=auth.currentUser
            await user.updatePassword(password);
            const idTokenResult=await user.getIdTokenResult()
            //redux

            createOrUpdateUser(idTokenResult.token)
            .then((res)=>{
              dispatch({
                type:'LOGGED_IN_USER',
                payload:{
                  name:res.data.name,
                  email:res.data.email,
                  token:idTokenResult.token,
                  role:res.data.role,
                  _id:res.data._id
                }
              })
            }).catch((err)=>{
              console.log(err);
            });

            history.push('/');
          }
        } catch (error) {
          toast.error(error.message);
        }
        
    }

    const completeRegistrationForm=()=>(
        <form onSubmit={handleSubmit}>        
        <input
        type="email"
        className="form-control"
        value={email} 
        disabled

      />
      <br/> 
       <input
      type="password"
      className="form-control"
      value={password}
      onChange={(e)=> setPassword(e.target.value)}
      autoFocus
      placeholder="Enter valid password"

    />
    <br/>
      <button type="submit" className="btn btn-raised">
        Final Register
      </button>
        </form>
    
    )
    return(
        <div className="container p-5">
        <div className="row">
         <div className="col-md-6 offset-md-3">
         <h4>Register the email</h4>
         <h6>Complete your registration</h6>
   
         {completeRegistrationForm()}
         </div>
        </div>
       </div>
    )
}
export default RegisterComplete;