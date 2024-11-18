import React, { useState } from "react";
import "./Forget.css";

export default function Forget() {
  const [email, setEmail] = useState();
  const [error, setError] = useState();
  const [success, setSuccess] = useState();

  const handleForget = async (event) => {
    event.preventDefault();

    const res = await fetch(`http://localhost:5879/api/user/forget-password`, {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (!data.link) {
      setError(data.message);
      setSuccess("");
    } else {
      setSuccess("Email send successfully");
      setError("");
      setEmail("");
    }
    console.log(data);
  };
  return (
    <section id="forget">
      <div className="container">
        <div className="row" id="forget-row">
          <div className="col" id="design-col1">
            <div className="triangle-up"></div>
            <p id="welcome">Forget the mistakes remember the lesson!!!!</p>

            <div className="circle"></div>
            <div className="circle1"></div>
            <h4 id="tool">Communication TooL</h4>
            <div className="circle2"></div>

            <div className="triangle-down"></div>
          </div>
          <div className="col" id="form-col2">
            <h4>Forgot</h4>
            <form>
              <div id="forget-field">
                <label>email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="forget-btn">
                <button onClick={handleForget}>Update</button>
              </div>
              {error ? (
                <div className="error">{error}</div>
              ) : (
                <div className="success">{success}</div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
