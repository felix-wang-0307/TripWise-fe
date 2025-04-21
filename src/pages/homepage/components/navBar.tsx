import React, { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "bootstrap/dist/css/bootstrap.min.css";

interface NavbarProps {
  onUserIdLoaded?: (userId: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onUserIdLoaded }) => {
  const navigate = useNavigate();
  const token = Cookies.get("authToken");
  const APIURL = import.meta.env.VITE_APIURL;
  const [newpassword, setnewpassword] = useState("");
  const [confirmpassword, setconfrimpw] = useState("");
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [tempusername, settempusername] = useState("");
  const [tempemail, settempemail] = useState("");
  const [resetToken, setresetToken] = useState("");
  const [tempdisplayname, settempDPname] = useState("");
  const [myinfo, setmyinfo] = useState(false);
  const [changedisplay, setchangedisplay] = useState(false);
  const [Resetpwsee, setResetpwsee] = useState(false);
  const [Resetpw2, setResetpw2] = useState(false);
  const [Resetpw3, setResetpw3] = useState(false);
  const [Reset1rep, setReset1rep] = useState("");
  const [error, setError] = useState("");
  const [Reset2rep, setReset2rep] = useState("");
  const [answer, setanswer] = useState("");
  const [changeusernemae, setchangeusername] = useState(false);
  const [changeemail, setchangeemail] = useState(false);
  const [displayname, setDPname] = useState("");
  const [email, setemail] = useState("");
  const [msgvis, setmsgvis] = useState(false);
  const [updatemsg, setupdatemsg] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const myInfoclick = () => {
    setmyinfo(!myinfo);
  };
  function backtologin() {
    Cookies.remove("authToken");
    //console.log("resetpw cookie still exist?", Cookies.get("authToken"));
    setTimeout(() => navigate("/login"), 1500);
  }
  const senddpreq = async () => {
    try {
      const requestbody = {
        userId,
        token,
        username: tempusername,
        displayName: tempdisplayname,
        email: tempemail,
      };

      const response = await fetch(`${APIURL}/api/auth/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestbody),
        mode: "cors",
      });

      //const data = await response.json();
      setmsgvis(true);

      if (response.status === 200) {
        setupdatemsg("Your profile has been updated successfully.");
        setUsername(tempusername);
        setDPname(tempdisplayname);
        setemail(tempemail);
      } else {
        setupdatemsg("Profile update failed. Please try again.");
      }

      setTimeout(() => setmsgvis(false), 2000);
    } catch (err) {
      console.error(err);
      setmsgvis(true);
      setupdatemsg("An error occurred. Please try again later.");
    }
  };

  const displaynameChange = () => {
    setchangedisplay(false);
    senddpreq();
  };
  const monitorPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setnewpassword(value);
    if (value.length < 5) {
      setError("Password must be at least 5 characters");
    } else {
      setError("");
    }
  };
  const usernameChange = () => {
    setchangeusername(false);
    senddpreq();
  };

  const emailChange = () => {
    setchangeemail(false);
    senddpreq();
  };
  const Resetpwreq2 = async () => {
    console.log("sending req to reset password2");
    try {
      const response = await fetch(
        `${APIURL}/api/auth/reset-password-2`,

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, securityAnswer: answer, userId }),
          mode: "cors",
        }
      );

      const data = await response.json();
      //console.log("Response received for resetpw-2:", data);
      if (response.status == 200) {
        setResetpw3(true);
        setResetpw2(false);
        //console.log(data.passwordResetToken);
        setresetToken(data.passwordResetToken);
      } else {
        //console.log("fail to request for resetpw2");
      }
    } catch (err) {
      //console.error("Error:", err);
    }
  };
  const Resetpw = async () => {
    //console.log("sending req to reset password1:usedID:", userId);
    //console.log("token", token);
    try {
      const response = await fetch(
        `${APIURL}/api/auth/reset-password-1`,

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, token }),
          mode: "cors",
        }
      );

      const data = await response.json();
      //console.log("Response received for resetpw-1:", data);
      if (response.status == 200) {
        setResetpw2(true);
        setResetpwsee(false);
        console.log(data.securityQuestion);
        setReset1rep(data.securityQuestion);
      } else {
        //console.log("fail to request for resetpw");
      }
    } catch (err) {
      //console.error("Error:", err);
    }
  };
  const sendresetReq = async () => {
    //console.log("sending req to reset password3");
    try {
      const response = await fetch(
        `${APIURL}/api/auth/reset-password-3`,

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            token: token,
            password: newpassword,
            passwordResetToken: resetToken,
          }),
          mode: "cors",
        }
      );

      const data = await response.json();
      //console.log("Response received for resetpw-3:", data);

      if (response.status == 200) {
        setReset2rep("update successfully");
        setTimeout(() => {
          setReset2rep("");
          backtologin(); // 3秒後才跳轉
        }, 3000);
      } else {
        setReset2rep("reset failed");
        setTimeout(() => setReset2rep(""), 3000);
        //console.log("fail to request for resetpw-3");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const logoutreq = async () => {
    try {
      const requestBody = { userId, token };
      const response = await fetch(`${APIURL}/api/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        mode: "cors",
      });

      //const data = await response.json();

      if (response.status === 200) {
        Cookies.remove("authToken");
        setUserId("");
        if (onUserIdLoaded) {
          onUserIdLoaded("");
        }

        setUsername("");
        setDPname("");
        navigate("/login");
      } else {
        alert("Failed to log out.");
      }
    } catch (err) {
      console.error(err);
      alert("Error logging out.");
    }
  };

  useEffect(() => {
    if (!token) {
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`${APIURL}/api/auth/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: `${token}`,
          },
          mode: "cors",
        });

        const data = await response.json();

        if (response.status === 200) {
          setUserId(data.userId);
          if (onUserIdLoaded) {
            onUserIdLoaded(data.userId);
          }

          setUsername(data.username);
          setDPname(data.displayName);
          setemail(data.email);
        } else {
          navigate("/login");
        }
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    };

    fetchUserInfo();
  }, [token, navigate]);

  return (
    <nav className="navbar navbar-light bg-light border-bottom py-3">
      <div className="container d-flex justify-content-between align-items-center">
        <a
          className="navbar-brand"
          href="/"
          style={{ display: "flex", alignItems: "center", gap: "5px" }}
        >
          {/* <span style={{ fontSize: "30px", marginRight: "8px" }}>🏕️</span> */}
          <img src="/tripwise.png" alt="logo" style={{ width: "40px", height: "40px" }} />
          <span
            style={{ fontSize: "22px", fontWeight: "bold", color: "#336296" }}
          >
            TripWise
          </span>
        </a>

        {/* Menu 按鈕放右邊 */}
        <Dropdown
          align="end"
          show={showMenu}
          onToggle={(isOpen) => {
            setShowMenu(isOpen);
            if (!isOpen) {
              // Dropdown 被關閉時 reset 所有密碼重設流程
              setResetpwsee(false);
              setResetpw2(false);
              setResetpw3(false);
              setReset1rep("");
              setReset2rep("");
              setanswer("");
              setnewpassword("");
              setconfrimpw("");
              setresetToken("");
              setError("");
              setchangedisplay(false);
              setchangeusername(false);
              setchangeemail(false);
              setmsgvis(false);
              setupdatemsg("");

              setmyinfo(false);
              settempDPname("");
              settempusername("");
              settempemail("");
            }
          }}
        >
          <Dropdown.Toggle
            as="button"
            id="dropdown-custom"
            style={{
              border: "2px solid #336296",
              color: "#336296",
              backgroundColor: "transparent",
              padding: "6px 16px",
              borderRadius: "6px",
              fontWeight: "bold",
              transition: "0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#336296";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#336296";
            }}
          >
            ☰ Menu
          </Dropdown.Toggle>

          <Dropdown.Menu style={{ minWidth: "300px", padding: "15px" }}>
            <div className="text-center mb-2">
              <strong>Hello, {displayname}</strong>
            </div>
            <hr />

            <Dropdown.Item
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation(); // ✅ 阻止 Dropdown 自動關閉
                myInfoclick(); // ✅ 呼叫函數
              }}
            >
              My Info
            </Dropdown.Item>
            {myinfo && (
              <div className="px-2 py-2 bg-light rounded mb-2">
                <ul className="list-group small">
                  <li className="list-group-item">Username: {username}</li>
                  <li className="list-group-item">UserId: {userId}</li>
                  <li className="list-group-item">
                    Displayname: {displayname}
                  </li>
                  <li className="list-group-item">Email: {email}</li>
                </ul>
              </div>
            )}

            <Dropdown.Item
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setResetpwsee(!Resetpwsee);
              }}
            >
              Reset Password
            </Dropdown.Item>
            {Resetpwsee && (
              <div className="px-2 py-2 bg-light rounded mb-2">
                <button
                  className="btn btn-info w-100"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    Resetpw();
                  }}
                >
                  Reset my password
                </button>
              </div>
            )}
            {Resetpw2 && (
              <div className="px-2 py-2 bg-light rounded mb-2">
                <span>Question:{Reset1rep}</span>
                <input
                  className="form-control mb-2"
                  placeholder="Answer the security question"
                  onChange={(e) => {
                    setanswer(e.target.value);
                  }}
                />
                <button
                  className="btn btn-info w-100"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    Resetpwreq2();
                  }}
                >
                  Update
                </button>
              </div>
            )}
            {Resetpw3 && (
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
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      sendresetReq();
                    }}
                    disabled={!(newpassword === confirmpassword)}
                  >
                    Reset password
                  </button>
                </div>
                <div className="text-center pt-3 pb-3 text-danger ">
                  <span>{Reset2rep}</span>
                </div>
              </>
            )}
            <Dropdown.Item
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setchangedisplay(!changedisplay);
              }}
            >
              Change Displayname
            </Dropdown.Item>
            {changedisplay && (
              <div className="px-2 py-2 bg-light rounded mb-2">
                <input
                  className="form-control mb-2"
                  placeholder="New display name"
                  value={tempdisplayname}
                  onChange={(e) => {
                    settempDPname(e.target.value);
                    settempusername(username);
                    settempemail(email);
                  }}
                />
                <button
                  className="btn btn-info w-100"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    displaynameChange();
                  }}
                  disabled={!tempdisplayname}
                >
                  Update
                </button>
              </div>
            )}

            <Dropdown.Item
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setchangeusername(!changeusernemae);
              }}
            >
              Change Username
            </Dropdown.Item>
            {changeusernemae && (
              <div className="px-2 py-2 bg-light rounded mb-2">
                <input
                  className="form-control mb-2"
                  placeholder="New username"
                  value={tempusername}
                  onChange={(e) => {
                    settempusername(e.target.value);
                    settempemail(email);
                    settempDPname(displayname);
                  }}
                />
                <button
                  className="btn btn-info w-100"
                  onClick={usernameChange}
                  disabled={!tempusername}
                >
                  Update
                </button>
              </div>
            )}

            <Dropdown.Item
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setchangeemail(!changeemail);
              }}
            >
              Change Email
            </Dropdown.Item>
            {changeemail && (
              <div className="px-2 py-2 bg-light rounded mb-2">
                <input
                  className="form-control mb-2"
                  placeholder="New email"
                  value={tempemail}
                  onChange={(e) => {
                    settempemail(e.target.value);
                    settempusername(username);
                    settempDPname(displayname);
                  }}
                />
                <button
                  className="btn btn-info w-100"
                  onClick={emailChange}
                  disabled={!validateEmail(tempemail)}
                >
                  Update
                </button>
                {!validateEmail(tempemail) && tempemail.length > 0 && (
                  <div className="text-danger small mt-1">
                    Please enter a valid email.
                  </div>
                )}
              </div>
            )}

            <hr />
            <Dropdown.Item
              onClick={logoutreq}
              className="text-danger text-center"
            >
              Log Out
            </Dropdown.Item>
            {msgvis && (
              <div className="text-center mt-2 text-success small">
                {updatemsg}
              </div>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </nav>
  );
};

export default Navbar;
