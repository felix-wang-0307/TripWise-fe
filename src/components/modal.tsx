import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function Modal() {
  const navigate = useNavigate();
  const token = Cookies.get("authToken");
  const APIURL = import.meta.env.VITE_APIURL;
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [tempusername, settempusername] = useState("");
  const [tempemail, settempemail] = useState("");
  const [tempdisplayname, settempDPname] = useState("");
  const [myinfo, setmyinfo] = useState(false);
  const [changedisplay, setchangedisplay] = useState(false);
  const [changeusernemae, setchangeusername] = useState(false);
  const [changeemail, setchangeemail] = useState(false);
  const [displayname, setDPname] = useState("");
  const [email, setemail] = useState("");
  const [visibility, setvisible] = useState(false);
  const [bye, setbye] = useState(false);
  const [updatemsg, setupdatemsg] = useState("");
  const [msgvis, setmsgvis] = useState(false);
  const [alertvisible, setalertvisible] = useState(false);

  function faillogout() {
    setTimeout(() => {
      setvisible(false);
    }, 1000);
  }
  function myInfoclick() {
    console.log("myinfo is clicked");
    setmyinfo(!myinfo);
  }
  const senddpreq = async () => {
    try {
      const requestbody = {
        userId: userId,
        token: token,
        username: tempusername,
        displayName: tempdisplayname,
        email: tempemail,
      };
      console.log("send update request:", JSON.stringify(requestbody, null, 2));

      const response = await fetch(`${APIURL}/api/auth/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestbody),
        mode: "cors",
      });

      const data = await response.json();
      console.log("Response received:", data);
      setmsgvis(true);
      if (response.status == 200) {
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

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  function displaynameChange() {
    console.log("changedisplayname is clicked");
    senddpreq();
  }
  function usernameChange() {
    console.log("change username is clicked");
    setchangeusername(!changeusernemae);
    senddpreq();
  }
  function emailChange() {
    console.log("change email is clicked");
    setchangeemail(!changeemail);
    senddpreq();
  }

  const logoutreq = async () => {
    try {
      console.log("Sending req to log out");
      const requestBody = {
        userId,
        token,
      };
      console.log("Request Body:", requestBody);
      const response = await fetch(`${APIURL}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        mode: "cors",
      });
      const data = await response.json();
      console.log("Logout result received:", data);
      if (response.status == 200) {
        {
          /*below trigger useEffect so need login again*/
        }
        setbye(true);
        setTimeout(() => {
          Cookies.remove("authToken");
          console.log("cookie still exist?", Cookies.get("authToken"));
          setUserId("");
          setUsername("");
          setDPname("");
          navigate("/login");
        }, 2000);
      } else {
        setvisible(true);
        {
          /* fail to logout, pop up meg*/
        }
        console.log("fail to log out");
        faillogout();
      }
    } catch (err) {
      console.error(err);
      faillogout();
      setvisible(true);
    }
  };
  useEffect(() => {
    if (!token) {
      console.log("No token found, redirecting to login...");
      setalertvisible(true);
      setTimeout(() => navigate("/login"), 1500);

      return;
    }

    const fetchUserInfo = async () => {
      try {
        console.log("Sending request to get personal info...");
        const response = await fetch(`${APIURL}/api/auth/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: `${token}`,
          },
          mode: "cors",
        });

        const data = await response.json();
        console.log("Personal info received:", data);

        if (response.status == 200) {
          setUserId(data.userId);
          setUsername(data.username);
          setDPname(data.displayName);
          setemail(data.email);
        } else {
          console.error(
            "Failed to fetch personal info, redirecting to login..."
          );
          navigate("/login");
        }
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    };

    fetchUserInfo();
  }, [token, navigate]); // 🚀 useEffect depends on token，whenever token changes trigger

  return (
    <>
      <button
        className="btn btn-primary"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasScrolling"
        aria-controls="offcanvasScrolling"
      >
        personal button
      </button>

      {/* Offcanvas Component */}

      <div
        className="offcanvas offcanvas-start"
        data-bs-scroll="true"
        data-bs-backdrop="false"
        tabIndex={-1}
        id="offcanvasScrolling"
        aria-labelledby="offcanvasScrollingLabel"
      >
        <div className="offcanvas-header">
          <h1 className="offcanvas-title" id="offcanvasScrollingLabel">
            Hello, {displayname}
          </h1>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          {userId ? (
            <>
              <div className="mb-4">
                <button className="btn btn-primary w-100" onClick={logoutreq}>
                  Logout
                </button>
              </div>

              <div className="dropdown mt-4">
                {/* Add margin-bottom to separate from Logout */}
                <button
                  className="btn btn-secondary dropdown-toggle w-100"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Personal Settings
                </button>
                <ul className="dropdown-menu w-100">
                  {/* Personal info */}
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={(event) => {
                        event.stopPropagation();
                        myInfoclick();
                      }}
                    >
                      My info
                      {myinfo && (
                        <div>
                          <ul className="list-group">
                            <li className="list-group-item">
                              Username: {username}
                            </li>
                            <li className="list-group-item">
                              UserId: {userId}
                            </li>
                            <li className="list-group-item">
                              Displayname: {displayname}
                            </li>
                            <li className="list-group-item">Email: {email}</li>
                          </ul>
                        </div>
                      )}
                    </a>
                  </li>
                  {/* Reset Password */}
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={() => navigate("/resetpw")}
                    >
                      Reset Password
                    </a>
                  </li>
                  {/* Change displayname */}
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={(event) => {
                        event.stopPropagation();
                        setchangedisplay(!changedisplay);
                      }}
                    >
                      Change Displayname
                    </a>
                    {changedisplay && (
                      <div className="mt-3 p-3 border rounded bg-light">
                        <label className="col-4 col-form-label text-start">
                          Display Name
                        </label>
                        <div className="col-8">
                          <input
                            className="form-control"
                            placeholder="Enter new display name"
                            value={tempdisplayname}
                            onChange={(e) => {
                              settempDPname(e.target.value);
                              settempemail(email);
                              settempusername(username);
                            }}
                          />
                        </div>
                        <div className="text-center mt-3">
                          <button
                            type="button"
                            className="btn btn-info text-center"
                            onClick={displaynameChange}
                            disabled={!(tempdisplayname !== "")}
                          >
                            Revise displayname
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                  {/* change username */}
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={(event) => {
                        event.stopPropagation();
                        setchangeusername(!changeusernemae);
                      }}
                    >
                      Change Username
                    </a>
                    {changeusernemae && (
                      <div className="mt-3 p-3 border rounded bg-light">
                        <label className="col-4 col-form-label text-start">
                          Username
                        </label>
                        <div className="col-8">
                          <input
                            className="form-control"
                            placeholder="Enter new username"
                            value={tempusername}
                            onChange={(e) => {
                              settempusername(e.target.value);
                              settempemail(email);
                              settempDPname(displayname);
                            }}
                          />
                        </div>
                        <div className="text-center mt-3">
                          <button
                            type="button"
                            className="btn btn-info text-center"
                            disabled={!(tempusername !== "")}
                            onClick={usernameChange}
                          >
                            Revise Username
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                  {/* change email */}
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={(event) => {
                        event.stopPropagation();
                        setchangeemail(!changeemail);
                      }}
                    >
                      Change Email
                    </a>

                    {changeemail && (
                      <div className="mt-3 p-3 border rounded bg-light">
                        <label className="col-4 col-form-label text-start">
                          Email
                        </label>
                        <div className="col-8">
                          <input
                            className="form-control"
                            placeholder="Enter new email"
                            value={tempemail}
                            onChange={(e) => {
                              settempemail(e.target.value);
                              settempDPname(displayname);
                              settempusername(username);
                            }}
                          />
                        </div>
                        <div className="text-center mt-3">
                          <button
                            type="button"
                            className="btn btn-info text-center"
                            onClick={emailChange}
                            disabled={!validateEmail(tempemail)}
                          >
                            Revise Email
                          </button>

                          {!validateEmail(tempemail) &&
                            tempemail.length > 0 && (
                              <p className="text-danger">
                                Please enter a valid email
                              </p>
                            )}
                        </div>
                      </div>
                    )}
                  </li>
                </ul>
              </div>

              {/* Spacer to push the logout button to the bottom */}
            </>
          ) : (
            <p>Loading user info...</p>
          )}
        </div>
      </div>

      {/*modal to show logout message*/}
      {visibility && (
        <div
          className="alert alert-primary position-fixed top-0 start-50 translate-middle-x mt-3"
          role="alert"
          style={{ zIndex: 1050, width: "30%", margin: "0 auto" }}
        >
          Logout Failed. Please try again :(
        </div>
      )}
      {bye && (
        <div
          className="alert alert-primary position-fixed top-0 start-50 translate-middle-x mt-3"
          role="alert"
          style={{ zIndex: 1050, width: "30%", margin: "0 auto" }}
        >
          <p>Goodbye, {displayname}!</p>
          <p>We hope to see you again soon.</p>
        </div>
      )}
      {alertvisible && (
        <div
          className="alert alert-primary position-fixed top-0 start-50 translate-middle-x mt-3"
          role="alert"
          style={{ zIndex: 1050, width: "30%", margin: "0 auto" }}
        >
          {" "}
          <p>You're not logged in.</p>
          <p>Please log in to continue.</p>
        </div>
      )}

      {/*update request return msg*/}
      {msgvis && (
        <div
          className="alert alert-warning text-center"
          role="alert"
          style={{ zIndex: 1050, width: "30%", margin: "0 auto" }}
        >
          {updatemsg}
        </div>
      )}
    </>
  );
}

export default Modal;
