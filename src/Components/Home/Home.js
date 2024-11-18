import React, { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";

let msgerChat;
let isMounted = false;
let socket;
let roomId = "";

export default function Home() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState([]);
  const [avatarPreview, setAvatarPreview] = useState(
    "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png"
  );

  const { id } = useParams();

  async function getUser() {
    const res = await fetch(`http://localhost:5879/api/user/getuser/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setUserData(data.user);
  }
  console.log(userData.avatar);

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (isMounted) return;
    isMounted = true;

    msgerChat = document.querySelector(".msger-chat");

    socket = io("http://localhost:5879");

    socket.on("connect", () => {
      appendMessage("right", socket.id, "ChatId");
    });

    socket.on("receive-message", (message) => {
      appendMessage("left", message, "Server");
    });
  }, []);

  function appendMessage(side, text, person) {
    const msgHTML = `    
    <div class="msger-chat">
    <div class='msg ${side}-msg'>
    
    <div class='msg-text'><p class='msg-person'>${person} :</p>${text}</div></div>
    </div>
    `;

    msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  }

  const onSendClick = (event) => {
    event.preventDefault();

    const msgText = document.getElementsByClassName("msgr-input")[0].value;

    if (!msgText) return;

    socket.emit("send-message", msgText, roomId);

    appendMessage("right", msgText, "You");
  };

  const onJoinLink = (e) => {
    e.preventDefault();

    roomId = document.getElementsByClassName("msgr-join")[0].value;

    socket.emit("join-room", roomId, (message) => {
      appendMessage("right", "joined to the room " + message, "You");
    });

    console.log(roomId, "roomId");
  };

  return (
    <div id="home" className="">
      <div>
        <div className="row" id="chat">
          <div className="col-4" id="messages">
            <div className="row" id="messager-profile">
              <img
                src={
                  userData.avatar ??
                  "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png"
                }
                alt="messager-profile"
              />
              <div className="messager-detail">
                <h5>{userData.username}</h5>
                <p>Available</p>
              </div>
            </div>
            <div id="message-content">
              <div id="msg-box">
                <span className="msger-chat"></span>
              </div>
            </div>

            <div className="row" id="message-input">
              <div className="col">
                <form id="text-input" className="msgr-inputarea">
                  <input
                    type="text"
                    placeholder="Type here..."
                    className="msgr-input"
                  />
                  <button
                    onClick={onSendClick}
                    className="msgr-send-btn"
                    type="submit"
                  >
                    Send
                  </button>
                </form>
                <div id="join-input">
                  <input
                    type="text"
                    placeholder="Type here..."
                    className="msgr-join"
                  />
                  <button onClick={onJoinLink}>join</button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-4" id="profile">
            <figure className="avatar mr-3 item-rtl">
              <img
                src={userData.avatar ?? avatarPreview}
                alt="Avatar"
                className="profile-page-img"
              />
            </figure>

            <h5 id="profile-name">{userData.username}</h5>
            <div className="bio">{userData.bio}</div>
            <button onClick={() => navigate(`/edit/${id}`)}>Edit</button>
          </div>
        </div>
      </div>
    </div>
  );
}
