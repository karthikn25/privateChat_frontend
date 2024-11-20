import React, { useState } from "react";
import "./Signin.css";
import { Link, useNavigate } from "react-router-dom";

export default function Signin() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();
  const [success, setSuccess] = useState();

  const navigate = useNavigate();

  const toggle = () => setShow(!show);

  const handleSignin = async (event) => {
    event.preventDefault();
    const userData = {
      email,
      password,
    };
    const res = await fetch(`https://privatechatapp-zcai.onrender.com/api/user/signin`, {
      method: "POST",
      body: JSON.stringify(userData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    console.log(data);
    if (!data.token) {
      setSuccess("");
      setError(data.message);
    } else {
      setSuccess(data.message);
      setError("");
      localStorage.setItem("token", data.token);
      localStorage.setItem("id",data.user._id);
      setTimeout(() => {
        navigate(`/home/${data.user._id}`);
      }, 2000);
    }
  };

  return (
    <section id="signin">
      <div className="container">
        <div className="row" id="signin-row">
          <div className="col" id="design-col">
            <div className="triangle-up"></div>
            <h4 id="welcome">Dark World</h4>

            <div className="circle"></div>
            <div className="circle1"></div>
            <h4 id="tool">Communication TooL</h4>
            <div className="circle2"></div>

            <div className="triangle-down"></div>
          </div>
          <div className="col" id="form-col">
            <h4>SignIn</h4>
            <form>
              <div id="signin-field">
                <label>email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div id="signin-field">
                <label>password</label>
                <input
                  type={!show ? "password" : "text"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div id="signin-pass-show">
                <input type="checkbox" onClick={toggle} /> Show
              </div>

              <div className="signin-btn">
                <button onClick={handleSignin}>Signin</button>
              </div>
            </form>
            <div id="signin-nav-link">
              <Link to="/forgot">Forget Password</Link>
            </div>
            <div id="signin-nav-link">
              Don't Have An Account?
              <Link to="/signup">Signup</Link>
            </div>
            {error ? (
              <div className="error">{error}</div>
            ) : (
              <div className="success">{success}</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
