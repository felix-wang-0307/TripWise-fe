// this is signup page
import { Dropdown } from "react-bootstrap";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap styles
import { useNavigate } from "react-router-dom";

function Signup() {
  const [password, setPassword] = useState("");
  const [confirmpassword, setconfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [answer, setAnswer] = useState("");
  const [prob, setprob] = useState("Security Question");
  const [message, setMessage] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalvisibility, setvisible] = useState(false);
  const [emailvisibility, setemailerror] = useState(false);

  const navigate = useNavigate();

  function backtomain() {
    setvisible(false);
    setTimeout(() => navigate("/login"), 1000);
  }
  {
    /*email validation*/
  }
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  {
    /*valid check*/
  }
  const overallformCheck = () => {
    return (
      validateEmail(email) &&
      password.length >= 5 &&
      username.trim() !== "" &&
      displayName.trim() !== "" &&
      confirmpassword === password &&
      prob !== "Security Question" &&
      answer.trim() !== ""
    );
  };
  {
    /*security prob state update*/
  }
  const selectSecurityQuestion = (question: string) => {
    setprob(question);
  };
  const monitorPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPassword(value);
    if (value.length > 0) {
      if (value.length < 5) {
        setError("Password must be at least 5 characters");
      } else {
        setError("");
      }
    }
  };

  const emailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    {
      /*initiate as error not shown*/
    }
    const value = event.target.value;
    setEmail(value);
    if (value.length > 0) {
      if (!validateEmail(value)) {
        setemailerror(true);
      } else {
        setemailerror(false);
      }
    }
  };

  const APIURL = import.meta.env.VITE_APIURL;

  const sendReq = async () => {
    try {
      const requestBody = {
        username: username,
        email: email,
        password: password,
        displayName: displayName,
        securityQuestion: prob,
        securityAnswer: answer,
      };
      //console.log("Request Body:", requestBody);
      const response = await fetch(`${APIURL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        mode: "cors",
      });

      const data = await response.json();
      //console.log("Response received:", data);
      switch (response.status) {
        case 201:
          setModalMessage(
            `Registered Successfully👍️\n You can now log in and start your journey! 👏`
          );
          break;

        case 400:
          setModalMessage(
            `This username or email is already in use.😟 \n Please try another one.`
          );
          break;
        default:
          setModalMessage(
            `Oops, something went wrong. Please try again later. 😿`
          );
          setMessage(data.stringify);
          break;
      }
      setvisible(true);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-start vh-100 mt-5">
      <div
        className="border rounded p-3 bg-light shadow-sm"
        style={{ width: "70%" }}
      >
        {/* Username*/}
        <div className="mb-3 row pt-3">
          <label className="col-5 col-form-label text-start">Username</label>
          <div className="col-7">
            <input
              className="form-control"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>
        {/* Email*/}
        <div className="mb-3 row pt-3">
          <label className="col-5 col-form-label text-start">
            Email address
          </label>
          <div className="col-7">
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email address"
              value={email}
              onChange={emailChange}
            />
          </div>
        </div>
        {/* Email error*/}
        {emailvisibility && (
          <div className="mb-3 row pt-3">
            <label className="col-5 col-form-label text-start"></label>
            <div className="col-7">
              <p style={{ color: "red" }}>⚠ Invalid Email Format!</p>
            </div>
          </div>
        )}
        {/* Password*/}
        <div className="mb-3 row">
          <label className="col-5 col-form-label text-start">Password</label>
          <div className="col-7">
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={monitorPassword}
              placeholder="At least 5 characters"
            />
            {error && <p className="text-danger">{error}</p>}
          </div>
        </div>
        {/* Confirm Password*/}
        <div className="mb-3 row">
          <label className="col-5 col-form-label text-start">
            Confirm Password
          </label>
          <div className="col-7">
            <input
              type="password"
              className="form-control"
              value={confirmpassword}
              onChange={(e) => setconfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
            />
            {confirmpassword.length > 0 && confirmpassword !== password && (
              <p className="text-danger">Password does not match</p>
            )}
          </div>
        </div>
        {/* Displayname*/}
        <div className="mb-3 row pt-3">
          <label className="col-5 col-form-label text-start">
            Display Name
          </label>
          <div className="col-7">
            <input
              className="form-control"
              placeholder="Enter your display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
        </div>
        {/* Security Question + Answer */}
        <div className="mb-3 row pt-3">
          <div className="col-5">
            <Dropdown>
              <Dropdown.Toggle
                variant="success"
                id="dropdown-basic"
                className="w-100"
              >
                {prob}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => selectSecurityQuestion("Primary school name")}
                >
                  Primary school name
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => selectSecurityQuestion("Mother's first name")}
                >
                  Mother's first name
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => selectSecurityQuestion("First pet's name")}
                >
                  First pet's name
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="col-7">
            <input
              className="form-control"
              placeholder="Enter your answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </div>
        </div>

        {/* Register Button*/}
        <div className="text-center pt-3 pb-3">
          <button
            type="button"
            className="btn btn-primary"
            style={{ width: "60%" }}
            disabled={!overallformCheck()}
            onClick={sendReq}
          >
            Register
          </button>
        </div>
        {message && <p className="text-success text-center">{message}</p>}
        {modalvisibility && (
          <div
            className="modal fade
            show d-block"
            tabIndex={-1}
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title">Server Response</h1>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={backtomain}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>
                    {modalMessage.split("\n").map((line, index) => (
                      <span key={index}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={backtomain}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Signup;
