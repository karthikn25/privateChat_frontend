import React, { useState } from "react";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [show, setShow] = useState(false);

  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();
  const [success, setSuccess] = useState();

  const navigate = useNavigate();

  const toggle = () => setShow(!show);

  const handleSignUp = async (event) => {
    event.preventDefault();
    const userData = {
      username,
      email,
      password,
    };
    const res = await fetch(`http://localhost:5879/api/user/signup`, {
      method: "POST",
      body: JSON.stringify(userData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (!data.token) {
      setError(data.message);
      setSuccess("");
    } else {
      setSuccess(data.message);
      setError("");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  };
  return (
    <section id="signup">
      <div className="container">
        <div className="row" id="signup-row">
          <div className="col" id="design-col">
            <div className="triangle-up"></div>
            <h4 id="welcome">Welcome Page</h4>

            <div className="circle"></div>
            <div className="circle1"></div>
            <h4 id="tool">Communication TooL</h4>
            <div className="circle2"></div>

            <div className="triangle-down"></div>
          </div>
          <div className="col" id="form-col1">
            <h4>SignUp</h4>
            <form>
              <div id="signup-field">
                <label>username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div id="signup-field">
                <label>email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div id="signup-field">
                <label>password</label>
                <input
                  type={!show ? "password" : "text"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div id="signup-pass-show">
                <input type="checkbox" onClick={toggle} /> Show
              </div>

              <div className="signup-btn">
                <button onClick={handleSignUp}>SignUp</button>
              </div>
            </form>
            <div id="signup-nav-link">
              Already Have An Account?
              <Link to="/">Signin</Link>
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
