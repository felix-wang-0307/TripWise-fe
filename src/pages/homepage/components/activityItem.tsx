import React, { useState } from "react";

interface Activity {
    groupId: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    participants: number[];
}

interface Props {
    activity: Activity;
    onDelete: (groupId: number) => void;
    userId: string;
}

const ActivityItem: React.FC<Props> = ({ activity, onDelete, userId }) => {
    const [isHovered, setIsHovered] = useState(false);


    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // 防止冒泡触发整个卡片的 onClick
        if (window.confirm(`Are you sure you want to delete "${activity.name}"?`)) {
            onDelete(activity.groupId);
        }
    };

    const handleCardClick = () => {
        // TODO: 实现跳转逻辑
        console.log("Card clicked! userId:", userId, "activityId:", activity.groupId);
        alert(`userId: ${userId}, activityId: ${activity.groupId}`); // TODO: FOR TEST
    };


    return (
        <div
            style={{
                borderRadius: "13px",
                padding: "15px 25px",
                backgroundColor: isHovered ? "#e6f3ff" : "#f9f9f9",
                boxShadow: isHovered
                    ? "0 4px 8px rgba(0, 0, 0, 0.2)" // 增大阴影
                    : "0 2px 4px rgba(0, 0, 0, 0.1)",
                position: "relative",
                transition: "all 0.3s ease",
                cursor: "pointer",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleCardClick}
        >
            <h4 style={{ marginBottom: "5px", color: "#084a86" }}>{activity.name}</h4>
            <p style={{ fontSize: "12px", color: "#888" }}>
                🗓 {activity.startDate} ~ {activity.endDate}
            </p>
            <p style={{ margin: "5px 0", fontSize: "13px", color: "#555" }}>
                {activity.description}
            </p>

            <button
                onClick={handleDeleteClick}
                style={{
                    position: "absolute",
                    top: "17px",
                    right: "10px",
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    backgroundColor: "#ddd",
                    color: "#fff",
                    border: "none",
                    fontSize: "14px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background-color 0.2s",
                }}
                title="Delete Activity"
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#ff5c5c")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ddd")}
            >
                ✖
            </button>
        </div>
    );
};

export default ActivityItem;
