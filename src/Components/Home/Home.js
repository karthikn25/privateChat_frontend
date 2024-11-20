import React, { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

let msgerChat;
let isMounted = false;
let socket;
let roomId = "";

export default function Home() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    avatar: "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png",
    username: "",
    bio: ""
  });
  const [avatarPreview, setAvatarPreview] = useState(
    "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png"
  );

  const id = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  // Function to fetch the user data
  async function getUser(id) {
    const res = await fetch(
      `https://privatechatapp-zcai.onrender.com/api/user/getuser/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();
    console.log("Fetched user data:", data); // Check the response for debugging
    if (data.user) {
      setUserData(data.user);
    }
  }

  // Fetch user data when the component mounts
  useEffect(() => {
    if (id) {
      getUser(id); // Fetch data only if ID is available in localStorage
    }
  }, [id]);

  useEffect(() => {
    if (isMounted) return;
    isMounted = true;

    msgerChat = document.querySelector(".msger-chat");

    socket = io("https://privatechatapp-zcai.onrender.com");

    socket.on("connect", () => {
      appendMessage("right", socket.id, "ChatId");
    });

    socket.on("receive-message", (message) => {
      appendMessage("left", message, "Server");
    });
  }, []);

  // Function to append messages to the chat
  function appendMessage(side, text, person) {
    const msgHTML = `
    <div class="msger-chat">
      <div class='msg ${side}-msg'>
        <div class='msg-text'>
          <p class='msg-person'>${person} :</p>
          ${text}
        </div>
      </div>
    </div>
    `;

    msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  }

  // Send message when the send button is clicked
  const onSendClick = (event) => {
    event.preventDefault();

    const msgText = document.getElementsByClassName("msgr-input")[0].value;

    if (!msgText) return;

    socket.emit("send-message", msgText, roomId);

    appendMessage("right", msgText, "You");
  };

  // Handle joining a room
  const onJoinLink = (e) => {
    e.preventDefault();

    roomId = document.getElementsByClassName("msgr-join")[0].value;

    socket.emit("join-room", roomId, (message) => {
      appendMessage("right", "joined the room " + message, "You");
    });

    console.log(roomId, "roomId");
  };

  // Render the component
  return (
    <div id="home">
      <div>
        <div className="row" id="chat">
          <div className="col-4" id="messages">
            <div className="row" id="messager-profile">
              <img
                src={userData.avatar || avatarPreview}
                alt="messager-profile"
              />
              <div className="messager-detail">
                <h5>{userData.username || "Loading..."}</h5>
                <p>{userData.bio ? "Available" : "No bio available"}</p>
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
                    placeholder="Enter room ID"
                    className="msgr-join"
                  />
                  <button onClick={onJoinLink}>Join</button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-4" id="profile">
            <figure className="avatar mr-3 item-rtl">
              <img
                src={userData.avatar || avatarPreview}
                alt="Avatar"
                className="profile-page-img"
              />
            </figure>

            <h5 id="profile-name">{userData.username || "Loading..."}</h5>
            <div className="bio">{userData.bio || "No bio available"}</div>
            <button onClick={() => navigate(`/edit/${token}`)}>Edit</button>
          </div>
        </div>
      </div>
    </div>
  );
}
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { io } from "socket.io-client";
// import "./Home.css";

// let msgerChat;
// let isMounted = false;
// let socket;
// let roomId = "";

// export default function Home() {
//   const navigate = useNavigate();
  
//   const [userData, setUserData] = useState({
//     avatar: "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png",
//     username: "",
//     bio: ""
//   });

//   const id = localStorage.getItem("id");
//   const token = localStorage.getItem("token");

//   // Function to fetch the user data
//   async function getUser(id, token) {
//     try {
//       const res = await fetch(`https://privatechatapp-zcai.onrender.com/api/user/getuser/${id}`, {
//         method: "GET",
//         headers: {
//           "Authorization": `Bearer ${token}`,  // Sending the token in the Authorization header
//         },
//       });
//       const data = await res.json();
//       if (data.success) {
//         setUserData(data.user);
//       } else {
//         console.error("Error fetching user:", data.message);
//       }
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//     }
//   }

//   useEffect(() => {
//     if (id && token) {
//       getUser(id, token); // Fetch data only if both ID and token are available
//     }
//   }, [id, token]);

//   useEffect(() => {
//     if (isMounted) return;
//     isMounted = true;

//     msgerChat = document.querySelector(".msger-chat");

//     socket = io("https://privatechatapp-zcai.onrender.com");

//     socket.on("connect", () => {
//       appendMessage("right", socket.id, "ChatId");
//     });

//     socket.on("receive-message", (message) => {
//       appendMessage("left", message, "Server");
//     });
//   }, []);

//   function appendMessage(side, text, person) {
//     const msgHTML = `
//       <div class="msger-chat">
//         <div class='msg ${side}-msg'>
//           <div class='msg-text'>
//             <p class='msg-person'>${person} :</p>
//             ${text}
//           </div>
//         </div>
//       </div>
//     `;
//     msgerChat.insertAdjacentHTML("beforeend", msgHTML);
//   }

//   const onSendClick = (event) => {
//     event.preventDefault();
//     const msgText = document.getElementsByClassName("msgr-input")[0].value;

//     if (!msgText) return;

//     socket.emit("send-message", msgText, roomId);
//     appendMessage("right", msgText, "You");
//   };

//   const onJoinLink = (e) => {
//     e.preventDefault();
//     roomId = document.getElementsByClassName("msgr-join")[0].value;

//     socket.emit("join-room", roomId, (message) => {
//       appendMessage("right", "joined the room " + message, "You");
//     });

//     console.log(roomId, "roomId");
//   };

//   return (
//     <div id="home">
//       <div className="row" id="chat">
//         <div className="col-4" id="messages">
//           <div className="row" id="messager-profile">
//             <img
//               src={userData.avatar || "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png"}
//               alt="messager-profile"
//             />
//             <div className="messager-detail">
//               <h5>{userData.username || "Loading..."}</h5>
//               <p>{userData.bio ? "Available" : "No bio available"}</p>
//             </div>
//           </div>
//           <div id="message-content">
//             <div id="msg-box">
//               <span className="msger-chat"></span>
//             </div>
//           </div>

//           <div className="row" id="message-input">
//             <div className="col">
//               <form id="text-input" className="msgr-inputarea">
//                 <input type="text" placeholder="Type here..." className="msgr-input" />
//                 <button onClick={onSendClick} className="msgr-send-btn" type="submit">
//                   Send
//                 </button>
//               </form>
//               <div id="join-input">
//                 <input type="text" placeholder="Enter room ID" className="msgr-join" />
//                 <button onClick={onJoinLink}>Join</button>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="col-4" id="profile">
//           <figure className="avatar mr-3 item-rtl">
//             <img src={userData.avatar || "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png"} alt="Avatar" className="profile-page-img" />
//           </figure>
//           <h5 id="profile-name">{userData.username || "Loading..."}</h5>
//           <div className="bio">{userData.bio || "No bio available"}</div>
//            <button onClick={() => navigate(`/edit/${token}`)}>Edit</button>

//         </div>
//       </div>
//     </div>
//   );
// }
