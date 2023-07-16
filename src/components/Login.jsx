import React, { useEffect, useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { userLogin } from '../store/actions/authAction';
import {useDispatch,useSelector} from "react-redux"
import { ERROR_CLEAR, SUCCESS_MESSAGE_CLEAR } from '../store/types/authType';
import { toast } from 'react-toastify';

const Login = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {loading,authenticate,error,successMessage,myInfo} = useSelector(state=>state.auth);

  useEffect(()=>{
      if(authenticate){
          navigate('/');
      }
      if(successMessage){
          toast.success(successMessage);
          dispatch({type : SUCCESS_MESSAGE_CLEAR })
      }
      if(error){
          error.map(err=>toast.error(err));
          dispatch({type : ERROR_CLEAR })
      }
  },[successMessage,error])


  const [state, setState] = useState({
       email: '',
       password : ''
  });

  const handleInputChange = e => {
       setState({
            ...state,
            [e.target.name] : e.target.value 
       })
  }

  const login = (e) => {
       e.preventDefault();
       dispatch(userLogin(state))
  }


  
  return (
    <div className='register'>
      <div className="card">
        <div className="card-header">
            <h3>Giriş Yap</h3>
        </div>

        <div className="card-body">
          <form onSubmit={login}>
            <div className="form-group">
              <label htmlFor='email'>E-posta</label>
              <input 
                id='email' 
                name="email"
                type='email' 
                className='form-control' 
                placeholder='E-posta' 
                onChange={handleInputChange}
                value={state.email}
                />
            </div>

            <div className="form-group">
              <label htmlFor='password'>Şifre</label>
              <input 
                id='password' 
                name="password"
                type='password' 
                className='form-control' 
                placeholder='Şifre'
                onChange={handleInputChange}
                value={state.password}
                />
            </div>

            <div className="form-group">
              <input type='submit' value='Giriş Yap' className='btn'/> 
            </div>

            <div className="form-group">
              <span>Hesabın yok mu?<Link to="/messenger/register">Hemen Kaydol</Link></span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login