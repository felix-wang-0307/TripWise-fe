import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap styles
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect } from "react";
function Resetpw() {
  const [email, setEmail] = useState("");
  const APIURL = import.meta.env.VITE_APIURL;
  const [emailvisibility, setemailvisible] = useState(true);
  const [token, setToken] = useState("");
  const [pwvisibility, setpwvisible] = useState(false);
  const [error, setError] = useState("");
  const [confirmpassword, setconfrimpw] = useState("");
  const [emailEror, setemailerror] = useState("");
  const [emailervisi, setemailervis] = useState(false);
  const [newpassword, setnewpassword] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalvisibility, setvisible] = useState(false);
  const [resetdone, setdone] = useState(false);
  const [resettryfail, setfail] = useState(false);
  const [answer, setAnswer] = useState("");
  const [prob, setprob] = useState("Security Question");
  const navigate = useNavigate();
  useEffect(() => {
    setEmail("");
    setAnswer("");
    setToken("");
    setnewpassword("");
    setconfrimpw("");
  }, []);
  {
    /*valid check*/
  }
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
  };
  const tokenCheck = () => {
    return (
      validateEmail(email) &&
      prob !== "Security Question" &&
      answer.trim() !== ""
    );
  };
  function backtologin() {
    setvisible(false);
    if (resetdone) {
      Cookies.remove("authToken");
      console.log("resetpw cookie still exist?", Cookies.get("authToken"));
      setTimeout(() => navigate("/login"), 1500);
    } else if (!resetdone && resettryfail) {
      {
        /*fail to reset pw because token expired or other problem */
      }
      {
        /*return to first step of reset pw: request new token using email*/
      }
      setEmail("");
      setAnswer("");
      setpwvisible(false);
      setnewpassword("");
      setemailvisible(true);
      setToken("");
      setTimeout(() => {
        setfail(false);
      }, 2000);
    }
  }
  {
    /*MONITOR NEW PW LENGTH */
  }
  const monitorPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setnewpassword(value);
    if (value.length < 5) {
      setError("Password must be at least 5 characters");
    } else {
      setError("");
    }
  };

  const selectSecurityQuestion = (question: string) => {
    setprob(question);
  };

  const emailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    {
      /*initiate as error not shown*/
    }
    const value = event.target.value;
    setEmail(value);
    if (value.length > 0) {
      if (!validateEmail(value)) {
        setemailervis(true);
        setemailerror("Please enter a valid email address.");
      } else {
        setemailervis(false);
        setemailerror("");
      }
    }
  };

  {
    /*SEND REQUEST TO GAIN TOKEN TO RESET PW */
  }

  const sendReq = async () => {
    console.log("sending req to reset password", email);
    try {
      const response = await fetch(
        `${APIURL}/api/auth/password-reset-request`,

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, prob, answer }),
          mode: "cors",
        }
      );

      const data = await response.json();
      console.log("Response received:", data);
      if (response.status == 200) {
        setModalMessage(`Start resetting password!  :) `);
        console.log(data.passwordResetToken);
        setToken(data.passwordResetToken);

        setemailvisible(false);
        setpwvisible(true);
      } else {
        setModalMessage(
          `Invalid request, wrong email or answer set,try again later `
        );
      }

      setvisible(true);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  {
    /*SEND REQUEST TO  RESET PW */
  }
  const sendresetReq = async (currentToken: string) => {
    console.log("Token:", currentToken);
    console.log("New Password:", newpassword);
    try {
      const response = await fetch(
        `${APIURL}/api/auth/reset-password`,

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resetToken: currentToken,
            newPassword: newpassword,
          }),
          mode: "cors",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Response received:", data);
      if (response.status == 200) {
        setModalMessage(`Password resetted!  :) `);
        setdone(true);
      } else {
        setModalMessage(`Oops, failed to reset,\n please try again later `);
        setfail(true);
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
        {/* enter Email to verify membership*/}
        {emailvisibility && (
          <>
            <div className="mb-3 row pt-3">
              <label className="col-5 col-form-label text-start">
                Email address
              </label>
              <div className="col-7">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email here"
                  value={email}
                  onChange={emailChange}
                />
              </div>
            </div>
            {emailervisi && (
              <>
                <div className="col-4"></div>
                <div className="col-8 text-danger">
                  <p>{emailEror}</p>
                </div>
              </>
            )}
            {/*Turn in answer of security problem*/}
            <div className="mb-3 row pt-3">
              <div className="dropdown col-5">
                <a
                  className="btn btn-success dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {prob}
                </a>

                <ul className="dropdown-menu">
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() =>
                        selectSecurityQuestion("Primary school name")
                      }
                    >
                      Primary school name
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() =>
                        selectSecurityQuestion("Mother's first name")
                      }
                    >
                      Mother's first name
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => selectSecurityQuestion("First pet's name")}
                    >
                      First pet's name
                    </button>
                  </li>
                </ul>
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

            {/* Request pw reset token Button*/}
            <div className="text-center pt-3 pb-3">
              <button
                type="button"
                className="btn btn-primary"
                style={{ width: "60%" }}
                onClick={sendReq}
                disabled={!tokenCheck()}
              >
                Verify
              </button>
            </div>
          </>
        )}

        {/* Reset Password block only visible when gain token*/}
        {pwvisibility && (
          <>
            <div className="mb-3 row">
              <label className="col-5 col-form-label text-start">
                Password
              </label>
              <div className="col-7">
                <input
                  type="password"
                  className="form-control"
                  value={newpassword}
                  onChange={monitorPassword}
                  placeholder="At least 5 characters required"
                />
                {error && <p className="text-danger">{error}</p>}
              </div>
            </div>
            <div className="mb-3 row">
              <label className="col-5 col-form-label text-start">
                Confirm Password
              </label>
              <div className="col-7">
                <input
                  type="password"
                  className="form-control"
                  value={confirmpassword}
                  onChange={(e) => setconfrimpw(e.target.value)}
                  placeholder="Re-enter your password"
                />
                {confirmpassword.length > 0 &&
                  confirmpassword !== newpassword && (
                    <p className="text-danger">Password does not match</p>
                  )}
              </div>
            </div>

            <div className="text-center pt-3 pb-3">
              <button
                type="button"
                className="btn btn-primary"
                style={{ width: "60%" }}
                onClick={() => sendresetReq(token)}
                disabled={!(newpassword === confirmpassword)}
              >
                Reset password
              </button>
            </div>
          </>
        )}
        {/* Show the result of request*/}
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
                    onClick={backtologin}
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
                    onClick={backtologin}
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

export default Resetpw;
