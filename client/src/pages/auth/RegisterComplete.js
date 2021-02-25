import React ,{useState ,useEffect} from 'react';
import {auth} from '../../firebase';
import { toast } from "react-toastify";
import {useDispatch,useSelector} from 'react-redux';
import {createOrUpdateUser} from '../../functions/auth';

const RegisterComplete=({history})=>{

    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')

    const { user } = useSelector((state) => ({ ...state }));

    useEffect(()=>{
        if(user && user.token) history.push("/");
    },[user,history]);

    let dispatch=useDispatch();

    useState(()=>{
        setEmail(window.localStorage.getItem('emailForRegistration'));
    },[])

    const handleSubmit=async (e)=>{
        e.preventDefault();
        if(!email || !password){
            toast.error("Email and password is required")
            return;
        }
        if(password.length < 8){
            toast.error("password must be 8 or more")
            return;
        }

       
        try {
            const result=await auth.signInWithEmailLink(email,window.location.href)
            if(result.email.emailVerified){
                window.localStorage.removeItem('emailForRegistration');
                let user=auth.currentUser

                await user.updatePassword(password);
                const idTokenResult=await user.getIdTokenResult()

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
               })
               .catch(err=>console.log(err)) ;
             
                history.push('/');
            }
        } catch (error) {
          toast.error(error.message)  
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

      <input
      type="password"
      className="form-control"
      value={password}
      autoFocus
      onChange={(e)=>setPassword(e.target.value)}
      placeholder="Password"
      />

      <button type="submit" className="btn btn-raised">
        Register
      </button>
        </form>
    )

return (
    <div className="container p-5">
     <div className="row">
      <div className="col-md-6.offset-md-3">
      <h4>Confirm Register</h4>


      {completeRegistrationForm()}
      </div>
     </div>
    </div>
)
}
export default RegisterComplete;