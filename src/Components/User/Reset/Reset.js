import React, { useState } from "react";
import "./Reset.css";
import { useParams } from "react-router-dom";

export default function Reset() {
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const { id, token } = useParams();

  const handleResetPassword = async (event) => {
    event.preventDefault();
    // if (password !== confirmPassword) {
    //   setError('Passwords do not match.');
    //   return;
    // }

    const url = `https://privatechatapp-zcai.onrender.com/api/user/reset-password/${id}/${token}`;

    const userdata = {
      password,
      confirmPassword,
    };
    const res = await fetch(url, {
      method: "PUT",
      body: JSON.stringify(userdata),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    console.log(data);
  };

  const toggle = () => setShow(!show);
  const toggle1 = () => setShow1(!show1);
  return (
    <section id="reset">
      <div className="container">
        <div className="row" id="reset-row">
          <div className="col" id="design-col3">
            <div className="triangle-up"></div>
            <p id="welcome1">
              "Passwords are just like underwear you should change them often...
              never share them unknown... "
            </p>

            <div className="circle"></div>
            <div className="circle1"></div>
            <h4 id="tool">Communication TooL</h4>
            <div className="circle2"></div>

            <div className="triangle-down"></div>
          </div>
          <div className="col" id="form-col">
            <h4>Change Password</h4>
            <form>
              <div id="reset-field">
                <label>Password</label>
                <input
                  type={!show ? "password" : "text"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div id="reset-pass-show">
                <input type="checkbox" onClick={toggle} /> Show
              </div>
              <div id="reset-field">
                <label>Confirm Password</label>
                <input
                  type={!show1 ? "password" : "text"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div id="reset-pass-show">
                <input type="checkbox" onClick={toggle1} /> Show
              </div>

              <div className="reset-btn">
                <button onClick={handleResetPassword}>Change</button>
              </div>
              {error ? (
                <div className="error">{error}</div>
              ) : (
                <div className="success">{message}</div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
