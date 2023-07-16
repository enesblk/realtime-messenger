import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {useDispatch,useSelector} from "react-redux"
import { userRegister } from '../store/actions/authAction';
import { toast } from 'react-toastify';

const Register = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {loading,authenticate,error,successMessage,myInfo} = useSelector(state=>state.auth);
  console.log(myInfo);

  const [state,setState] = useState({
    userName : '',
    email:'',
    password:'',
    confirmPassword : '',
    image : ''
  })
  const[loadImage, setLoadImage] = useState(null);

  useEffect(()=>{
      if(authenticate){
          navigate('/');
      }
      if(successMessage){
        toast.success(successMessage);
      }
      if(error){
          error.map(err=>toast.error(err));
      }

  },[successMessage,error])


  const handleInputChange = (e) => {
    setState({
      ...state,
      [e.target.name] : e.target.value 
    })
  }

  const fileHandle = (e) => {
    if(e.target.files.length !== 0){
      setState({
        ...state,
        [e.target.name]: e.target.files[0]
      })

      const reader = new FileReader();
      reader.onload = () => {
        setLoadImage(reader.result);
      }
      reader.readAsDataURL(e.target.files[0]);  
    }
  }

  const register = (e) => {
    
    const {userName,email,password,confirmPassword, image} = state;
    e.preventDefault();
    
    const formData = new FormData();

    formData.append('userName',userName);
    formData.append('email',email);
    formData.append('password',password);
    formData.append('confirmPassword',confirmPassword);
    formData.append('image',image);

    dispatch(userRegister(formData));
  }

  return (
    <div className='register'>
      <div className="card">
        <div className="card-header">
            <h3>Kayıt Ol</h3>
        </div>

        <div className="card-body">
          <form onSubmit={register}>
            <div className="form-group">
               <label htmlFor='username'>Kullanıcı Adı</label>
               <input 
                  id='username'
                  name="userName" 
                  type='text' 
                  className='form-control' 
                  placeholder='Kullanıcı Adı'
                  onChange={handleInputChange}
                  value={state.userName}
                />
            </div>

            <div className="form-group">
               <label htmlFor='email'>E-posta</label>
               <input 
                  id='email' 
                  name="email"
                  type='email' 
                  className='form-control' 
                  placeholder='E-posta'
                  defaultValue={state.email}
                  onChange={handleInputChange}
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
                  defaultValue={state.password}
                  onChange={handleInputChange}
                />
            </div>

            <div className="form-group">
               <label htmlFor='confirmPassword'>Şifreyi Onaylayın</label>
               <input 
                  id='confirmPassword' 
                  name="confirmPassword"
                  type='password' 
                  className='form-control' 
                  placeholder='Şifreyi Onaylayın' 
                  defaultValue={state.confirmPassword}
                  onChange={handleInputChange}
                />
            </div>

            <div className="form-group">
              <div className="file-image">
                <div className="image">{loadImage && <img src={loadImage} alt="img"/>}</div>
                <div className="file">
                  <label htmlFor='image'>Seçilen Resim</label>
                  <input 
                    type='file' 
                    className='form-control' 
                    id='image'
                    name="image"
                    defaultValue={state.image}
                    onChange={fileHandle}
                    />
                </div>
              </div>
            </div>

            <div className="form-group">
              <input type='submit' value='Kaydol' className='btn'/> 
            </div>

            <div className="form-group">
              <span>Zaten hesabın var mı?<Link to="/messenger/login">Giriş Yap</Link></span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register