import React from "react";
import { FaPhoneAlt, FaVideo, FaRocketchat } from "react-icons/fa";
import FriendInfo from "./FriendInfo";
import Message from "./Message";
import MessageSend from "./MessageSend";

const RightSide = (props) => {

  const {currentfriend,handleInputChange,newMessage,sendMessage,message,active, typingMessage, scrollRef} = props;

  console.log("right-side", typingMessage)


  return (
    <div className="col-9">
      <div className="right-side">
        <input type="checkbox" id="dot" />
        <div className="row">
          <div className="col-8">
            <div className="message-send-show">
              <div className="header">
                <div className="image-name">
                  <div className="image">
                    <img src={`./image/${currentfriend.image}`} alt='' />
                    {active &&  <div className='active-icon'></div> }
                  </div>
                  <div className="name-box">
                    <div className="name">
                      <h3>{currentfriend.userName} </h3>
                    </div>
                    {
                      typingMessage && typingMessage.msg && typingMessage.senderId === currentfriend._id
                      ?
                        <span className="typing-message">Yazıyor..</span> 
                      :
                      ''
                    }
                  </div>
                </div>

                <div className="icons">
                  <div className="icon">
                    <FaPhoneAlt />
                  </div>

                  <div className="icon">
                    <FaVideo />
                  </div>

                  <div className="icon">
                    <label htmlFor="dot">
                      {" "}
                      <FaRocketchat />{" "}
                    </label>
                  </div>
                </div>
              </div>

              <Message 
                message = { message}
                currentfriend = {currentfriend}
                scrollRef= {scrollRef}
              />
              <MessageSend
                handleInputChange = {handleInputChange}
                newMessage = {newMessage}
                sendMessage = {sendMessage}
              />
            </div>
          </div>

          <div className="col-4">
            <FriendInfo currentfriend={currentfriend} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSide;
