import React, { useEffect, useRef, useState } from "react";
import { FaEllipsisH, FaEdit, FaSistrix } from "react-icons/fa";
import Friends from './Friends';
import RightSide from './RightSide';
import {useDispatch, useSelector} from 'react-redux';
import { getFriends,messageSend, getMessage } from '../store/actions/messengerAction';

import {io} from 'socket.io-client';
import useSound from 'use-sound';
import notificationSound from '../assets/audio/notification.mp3';
import sendingSound from '../assets/audio/sending.mp3';

const Messenger = () => {

  const dispatch = useDispatch();
  const scrollRef = useRef();
  const socket = useRef();


  const [notificationSPlay] = useSound(notificationSound);   
  const [sendingSPlay] = useSound(sendingSound);  

  const [searchText, setSearchText] = useState('');
  const [currentfriend, setCurrentFriend] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [socketMessage, setSocketMessage] = useState('');
  const [typingMessage, setTypingMessage] = useState('');
  const [activeUser, setActiveUser] = useState([]);
  const {myInfo} = useSelector(state => state.auth);
  const {friends,message} = useSelector(state => state.messenger );

  useEffect(() => {
    socket.current = io('ws://192.168.1.55:8000');
    
    socket.current.on('getMessage', (data) => {
      setSocketMessage(data);
    })

    socket.current.on('typingMessageGet', (data) => {
      setTypingMessage(data);
    })
  },[]);

  useEffect(() => {
      if(socketMessage && currentfriend){
          if(socketMessage.senderId === currentfriend._id && socketMessage.reseverId === myInfo.id){
                dispatch({
                    type: 'SOCKET_MESSAGE',
                    payload : {
                          message: socketMessage
                    }
                })
          }
      }
      setSocketMessage('')
  },[socketMessage]);

 
  useEffect(() => {
    if(socketMessage && socketMessage.senderId !== currentfriend._id && socketMessage.reseverId === myInfo.id){
        notificationSPlay();
    }
  },[socketMessage]);


  useEffect(() => {
    socket.current.emit('addUser', myInfo.id, myInfo)
  },[]);

  useEffect(() => {
    socket.current.on('getUser', (users) => {
      const filterUser = users.filter(u => u.userId !== myInfo.id);
      setActiveUser(filterUser);
    })
  },[]);

  useEffect(() => {
    dispatch(getFriends());
  },[]);

  useEffect(() => {
    if(friends && friends.length > 0)
    setCurrentFriend(friends[0])
  },[friends]);

  useEffect(() => {
    dispatch(getMessage(currentfriend._id))
  },[ currentfriend?._id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({behavior: 'smooth'}) 
  },[ message]);


  const handleInputChange = (e) => {
    setNewMessage(e.target.value); 
    
    socket.current.emit('typingMessage', {
      senderId: myInfo.id,
      reseverId: currentfriend._id,
      msg: e.target.value
    })

  }

  const handleSearchText = (e) => {
      setSearchText(e.target.value);
  }

  const sendMessage = (e) => {
    e.preventDefault();
    sendingSPlay();
    const data = {
        senderName : myInfo.userName,
        reseverId : currentfriend._id,
        message : newMessage ? newMessage : ''
    }

    socket.current.emit('sendMessage',{
      senderId: myInfo.id,
      senderName: myInfo.userName,
      reseverId: currentfriend._id,
      time: new Date(),
      message : {
           text : newMessage ? newMessage : '❤',
           image : ''
      }
    })

    socket.current.emit('typingMessage', {
      senderId: myInfo.id,
      reseverId: currentfriend._id,
      msg: ''
    })

    dispatch(messageSend(data));
    setNewMessage('')
  }

  return (
    <div className="messenger">
      <div className="row">
        <div className="col-3">
          <div className="left-side">
            <div className="top">
              <div className="image-name">
                <div className="image">
                    <img src={`./image/${myInfo.image}`} alt='' />
                </div>
                <div className="name">
                  <h3>{myInfo.userName} </h3>
                </div>
              </div>

              <div className="icons">
                <div className="icon">
                  <FaEllipsisH />
                </div>
                <div className="icon">
                  <FaEdit />
                </div>
              </div>
            </div>

            <div className="friend-search">
              <div className="search">
                <button>
                  {" "}
                  <FaSistrix />{" "}
                </button>
                <input
                  type="text"
                  name="search"
                  placeholder="Search"
                  className="form-control"
                  onChange={handleSearchText}
                />
              </div>
            </div>
             
            <div className='friends'>
              {
                friends && friends.length>0 ? 
                  friends.filter(f => f.userName.startsWith(searchText)).map((fd) => 
                  <div onClick={()=> setCurrentFriend(fd)} className={currentfriend._id === fd._id ? 'hover-friend active' : 'hover-friend'}> 
                    <Friends friend={fd} active={ activeUser && activeUser.length > 0 ? activeUser.find(u => u.userId === fd._id): false} />
                  </div> ) 
                : 
                  'No Friend'
              } 
               </div>
          </div>
        </div>
        {
          currentfriend 
          ?  
          <RightSide 
            currentfriend={currentfriend}
            handleInputChange={handleInputChange}
            newMessage={newMessage}
            sendMessage={sendMessage}
            typingMessage={typingMessage}
            message={message}
            scrollRef= {scrollRef}
            active={ activeUser && activeUser.length > 0 ? activeUser.find(u => u.userId === currentfriend._id): false}
          /> 
          : 
          'Please Select your Friend'
         }
      </div>
    </div>
  );
};

export default Messenger;
