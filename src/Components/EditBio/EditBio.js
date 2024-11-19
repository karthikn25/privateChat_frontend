// import React, { useRef, useState } from "react";
// import "./EditBio.css";
// import { useNavigate, useParams } from "react-router-dom";

// export default function EditBio() {
//   const inputRef = useRef(null);

//   const [avatarPreview,setAvatarPreview]=useState("https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png");
//   const [success, setSuccess] = useState();
//   const [error, setError] = useState();

//   const navigate = useNavigate("");

//   const id = localStorage.getItem("id");

//   const handleImageClick = () => {
//     inputRef.current.click();
//   };



//   const [userDetails, setUserDetails] = useState({
//     username: '',
//     bio: '',
//     image: null,
//   });

//   const handleInputChange = (e) => {
//     setUserDetails({
//       ...userDetails,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleImageChange = (e) => {
//     setUserDetails({
//       ...userDetails,
//       avatar: e.target.files[0],
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append('username', userDetails.username);
//     formData.append('bio', userDetails.bio);
//     formData.append('avatar', userDetails.avatar);

//     try {
//       const response = await fetch(`https://privatechatapp-zcai.onrender.com/api/user/edit/${id}`, {
//         method: 'PUT', // or 'POST' if creating new user
//         body: formData,
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setError("");
//             setSuccess(data.message);
//             setTimeout(() => {
//               navigate(`/home/${data.data._id}`);
//             });
//       } else {
//         setError(data.message);
//         setSuccess("");
//       }
//     } catch (error) {
//       console.error('Error occurred:', error);
//     }
//   };
//   return (
//     <div className="container" id="editbio">
//       <div id="edit-box">
//       <form onSubmit={handleSubmit}>
//         <div onClick={handleImageClick} id="edit-img">
//         <img src={avatarPreview} alt="avatar"/> 
//           <input
//             type="file"
//             ref={inputRef}
//             name="image"
//             accept="image/*"
//             onChange={handleImageChange}
//           />
//         </div>
//         <div id="edit-fields">
//           <input
//             type="text"
//             name="username"
//             placeholder="Type your name..."
//             value={userDetails.name}
//             onChange={handleInputChange}
//           />
//           <textarea
//             type="text"
//             name="bio"
//             placeholder="Type your Bio..."
//             value={userDetails.bio}
//             onChange={handleInputChange}
//           />
//           <button type="submit">Submit</button>
//         </div>
//         {error ? (
//           <div id="error">{error}</div>
//         ) : (
//           <div id="success">{success}</div>
//         )}
//         </form>
//       </div>
//     </div>
//   );
// }
import React, { useRef, useState, useEffect } from "react";
import "./EditBio.css";
import { useNavigate } from "react-router-dom";

export default function EditBio() {
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const id = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const [avatarPreview, setAvatarPreview] = useState("https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png");
  const [userDetails, setUserDetails] = useState({
    username: '',
    bio: '',
    avatar: null,
  });

  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await fetch(`https://privatechatapp-zcai.onrender.com/api/user/getuser/${id}`);
        const data = await res.json();
        if (res.ok && data.user) {
          setUserDetails({
            username: data.user.username,
            bio: data.user.bio || "",
            avatar: data.user.avatar || null,
          });
          setAvatarPreview(data.user.avatar || avatarPreview); // Set the avatar preview
        } else {
          console.error("Failed to load user details.");
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    };

    fetchUserDetails();
  }, [id]);

  const handleImageClick = () => {
    inputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserDetails({ ...userDetails, avatar: file });
      setAvatarPreview(URL.createObjectURL(file)); // Update the preview image
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({
      ...userDetails,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, bio, avatar } = userDetails;

    // Check if username or bio are empty before submitting
    if (!username || !bio) {
      setError("Username and Bio are required.");
      setSuccess(null);
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("bio", bio);
    if (avatar) formData.append("avatar", avatar); // Only append avatar if it's changed

    try {
      const response = await fetch(`https://privatechatapp-zcai.onrender.com/api/user/edit/${id}`, {
        method: "PUT", // PUT request to update user data
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess(data.message);
        setError(null);
        setTimeout(() => {
          navigate(`/home/${token}`);
        }, 2000); // Redirect after 2 seconds
      } else {
        setError(data.message);
        setSuccess(null);
      }
    } catch (error) {
      console.error("Error occurred:", error);
      setError("An error occurred while updating your profile.");
      setSuccess(null);
    }
  };

  return (
    <div className="container" id="editbio">
      <div id="edit-box">
        <form onSubmit={handleSubmit}>
          <div onClick={handleImageClick} id="edit-img">
            <img src={avatarPreview} alt="avatar" />
            <input
              type="file"
              ref={inputRef}
              name="avatar"
              accept="image/*"
              style={{ display: 'none' }} // Hide the file input
              onChange={handleImageChange}
            />
          </div>
          <div id="edit-fields">
            <input
              type="text"
              name="username"
              placeholder="Type your name..."
              value={userDetails.username}
              onChange={handleInputChange}
            />
            <textarea
              name="bio"
              placeholder="Type your Bio..."
              value={userDetails.bio}
              onChange={handleInputChange}
            />
            <button type="submit">Submit</button>
          </div>
          {error && <div id="error">{error}</div>}
          {success && <div id="success">{success}</div>}
        </form>
      </div>
    </div>
  );
}
