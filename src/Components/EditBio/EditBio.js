import React, { useRef, useState } from "react";
import "./EditBio.css";
import { useNavigate } from "react-router-dom";

export default function EditBio() {
  const inputRef = useRef(null);

  const [avatarPreview,setAvatarPreview]=useState("https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png");
  const [success, setSuccess] = useState();
  const [error, setError] = useState();

  const navigate = useNavigate("");

  const id = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const handleImageClick = () => {
    inputRef.current.click();
  };



  const [userDetails, setUserDetails] = useState({
    username: '',
    bio: '',
    avatar: null,
  });

  const handleInputChange = (e) => {
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setUserDetails({
      ...userDetails,
      avatar: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('username', userDetails.username);
    formData.append('bio', userDetails.bio);
    formData.append('avatar', userDetails.avatar);

    try {
      const response = await fetch(`https://privatechatapp-zcai.onrender.com/api/user/edit/${id}`, {
        method: 'PUT', // or 'POST' if creating new user
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setError("");
            setSuccess(data.message);
            setTimeout(() => {
              navigate(`/home/${token}`);
            });
      } else {
        setError(data.message);
        setSuccess("");
      }
    } catch (error) {
      console.error('Error occurred:', error);
    }
  };
  return (
    <div className="container" id="editbio">
      <div id="edit-box">
      <form onSubmit={handleSubmit}>
        <div onClick={handleImageClick} id="edit-img">
        <img src={avatarPreview} alt="avatar"/> 
          <input
            type="file"
            ref={inputRef}
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <div id="edit-fields">
          <input
            type="text"
            name="username"
            placeholder="Type your name..."
            value={userDetails.name}
            onChange={handleInputChange}
          />
          <textarea
            type="text"
            name="bio"
            placeholder="Type your Bio..."
            value={userDetails.bio}
            onChange={handleInputChange}
          />
          <button type="submit">Submit</button>
        </div>
        {error ? (
          <div id="error">{error}</div>
        ) : (
          <div id="success">{success}</div>
        )}
        </form>
      </div>
    </div>
  );
}
