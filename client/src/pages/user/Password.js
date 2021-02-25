import React,{useState} from 'react';
import UserNav from '../../components/nav/UserNav';
import {auth} from '../../firebase';
import {toast } from 'react-toastify';

const Password=()=>{

    const [password,setPassword]=useState('');
    const [loading,setLoading]=useState(false);
    console.log(Password);

    const handleSubmit=async(e)=>{
        e.preventDefault();
        setLoading(true);
        setPassword("")
        await auth.currentUser.updatePassword(password)
        .then(()=>{
            setLoading(false);
            toast.success('password updated')
        })
        .catch((err)=>toast.error(err.message));

    }

    const passwordUpdateForm=()=>(
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Your Password</label>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          className="form-control"
          placeholder="Enter new password"
          disabled={loading}
          value={password}
        />
        <button
          className="btn btn-primary"
          disabled={!password || password.length < 8 || loading}
        >
          Submit
        </button>
      </div>
    </form>
    )

    return(        
    <div className="container-fluid">
    <div className="row">
      <div className="col-md-2">
       
     <UserNav />
      
      </div>
      <div className="col">
      {loading ? (<h4 className="text-danger">Loading ...</h4>) :(<h4>Update your password</h4>) }
      {passwordUpdateForm()}
      </div>
    </div>
  </div>
);
}
export default Password;
