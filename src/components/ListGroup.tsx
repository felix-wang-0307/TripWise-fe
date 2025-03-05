import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap styles
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function ListGroup() {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalvisibility, setvisible] = useState(false);
  const [suclogin, setlogin] = useState(false);
  const navigate = useNavigate();

  const APIURL = import.meta.env.VITE_APIURL;
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  function modallogic() {
    if (suclogin) {
      {
        /*successful login   -> direct to main page*/
      }
      setvisible(false);
      setTimeout(() => navigate("/"), 1000);
    } else {
      {
        /* need to fix sth, stay at same page */
      }
      setvisible(false);
    }
  }
  const overallformCheck = () => {
    return validateEmail(email) && password.length >= 5;
  };

  const login = async () => {
    try {
      console.log("sending req to login", email);
      const requestBody = {
        email,
        password,
      };

      console.log("Request Body:", requestBody);

      const response = await fetch(`${APIURL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        mode: "cors",
      });

      const data = await response.json();
      console.log("Response received:", data);
      if (response.status == 200) {
        setModalMessage(`Welcome back!!!  :) `);
        setlogin(true);
        Cookies.set("authToken", data.token, { expires: 7, secure: true });
      } else if (response.status == 401) {
        if (data.message == "Invalid email or password") {
          setModalMessage(`Wrong email or password :(  `);
        } else {
          setModalMessage(`User not found  :( `);
        }
      } else {
        setModalMessage(`Oops, weird thing happens, try again later `);
      }
    } catch (err) {
      console.error("Error:", err);
    }
    setvisible(true);
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-start vh-100 mt-5">
      <div
        className="border rounded p-2 bg-light shadow-sm "
        style={{ width: "70%" }}
      >
        <div className="mb-3 row">
          <label className="col-4 col-form-label text-start">
            Email address
          </label>
          <div className="col-8">
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setemail(e.target.value)}
            />
            {!validateEmail(email) && email.length > 0 && (
              <div className="text-danger mt-2">Please enter valid email</div>
            )}
          </div>
        </div>

        {/*READIN PASSWORD*/}
        <div className="mb-3 row">
          <label className="col-4 col-form-label text-start">Password</label>
          <div className="col-8">
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {/*LOGIN BUTTON*/}
        <div className="text-center">
          <button
            type="button"
            className="btn btn-primary"
            onClick={login}
            disabled={!overallformCheck()}
            style={{ width: "60%" }}
          >
            Log in
          </button>
        </div>

        {/*SIGNUP*/}
        <div className="mt-3 text-center">
          Don't have an account?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault(); // Prevents full page reload
              navigate("/signup"); // React Router navigation
            }}
            className="text-decoration-underline text-primary"
          >
            Sign up
          </a>{" "}
          now
        </div>

        {/*RESET PASSWORD*/}
        <div className="mt-3 text-center">
          Forgot your password? We've got this!{" "}
          <a
            href="#"
            onClick={() => navigate("/resetpw")}
            className="text-decoration-underline text-primary"
          >
            Reset it now
          </a>{" "}
        </div>

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
                    onClick={modallogic}
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
                    onClick={modallogic}
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

export default ListGroup;
