import React, { useState } from "react";
// import { OverlayTrigger, Popover } from "react-bootstrap";
import { Dropdown } from "react-bootstrap"
import "bootstrap/dist/css/bootstrap.min.css";



const getAvatarLetter = (userId: string) => {
    // 取 ID 里的第一个字母（大写）
    const letter = userId.replace(/[^A-Za-z]/g, "").charAt(0).toUpperCase();
    return letter || "🏄"; // 防止没有字母
};



const Navbar: React.FC = () => {

    const userId = "2"; // TODO: USER ID 从 Cookie 中获取
    const avatarLetter = getAvatarLetter(userId);
    const [showMenu, setShowMenu] = useState(false);
    // 处理登出逻辑
    const handleLogout = () => {
        console.log("User logged out"); // TODOl: 这里可以添加清除 Cookie 和跳转到登录页的逻辑
        alert("Logged out!");
    };





    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                {/* 网站名 */}
                <a className="navbar-brand" href="/" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <span style={{ fontSize: "30px", marginRight: "8px" }}>🏕️  </span> {/* icon */}
                    <span style={{ fontSize: "22px", fontWeight: "bold", color: "#336296" }}> TripWise</span> {/* text */}
                </a>




                {/* User Info & dropdown */}
                <Dropdown align="end" show={showMenu} onToggle={(isOpen) => setShowMenu(isOpen)}>
                    <Dropdown.Toggle
                        as="div"
                        bsPrefix="custom-toggle"
                        className="border-0 bg-transparent p-0"
                        onClick={() => setShowMenu(!showMenu)} // 点击时显示/隐藏下拉菜单
                    >
                        <div
                            style={{
                                width: "35px",
                                height: "35px",
                                borderRadius: "50%",
                                backgroundColor: "#1B3F69",
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "16px",
                                fontWeight: "100",
                                cursor: "pointer",
                            }}
                        >
                            {avatarLetter}
                        </div>
                    </Dropdown.Toggle>


                    <Dropdown.Menu style={{ borderRadius: "10px", width: "220px", padding: "10px", marginTop: "10px" }}>

                        <div className="p-2">
                            <p className="mb-2"><strong>User ID:</strong> {userId}</p>
                            <hr />

                            <Dropdown.Item onClick={handleLogout} className="text-danger">
                                Log Out
                            </Dropdown.Item>
                        </div>
                    </Dropdown.Menu>


                </Dropdown>


            </div>
        </nav >
    );
};

export default Navbar;
