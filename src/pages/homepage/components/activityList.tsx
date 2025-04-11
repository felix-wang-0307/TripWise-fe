import React from "react";
import ActivityItem from "./activityItem.tsx";

interface Activity {
    groupId: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    participants: number[];
}

interface Props {
    activities: Activity[];
    onDeleteActivity: (groupId: number) => void; // 新增删除活动的回调函数
    userId: string;
}

const ActivityList: React.FC<Props> = ({ activities, onDeleteActivity, userId }) => {
    // 按日期排序活动列表，最近的日期排在最上面
    const sortedActivities = activities.sort((a, b) => {
        const dateA = new Date(a.startDate).getTime();
        const dateB = new Date(b.startDate).getTime();
        return dateA - dateB; // 升序（日期越近越靠上）
    });

    return (
        <div>
            {activities.length === 0 ? (
                <p
                    style={{
                        textAlign: "center",
                        fontSize: "16px",
                        color: "#666",
                        backgroundColor: "#f9f9f9",
                        padding: "20px",
                        borderRadius: "13px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        maxWidth: "300px",
                        margin: "20px auto",
                    }}
                >
                    No Activity...
                </p>
            ) : (
                <div style={{ display: "grid", gap: "20px" }}>
                    {sortedActivities.map((activity) => (
                        <ActivityItem
                            key={activity.groupId}
                            activity={activity}
                            onDelete={onDeleteActivity}
                            userId={userId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ActivityList;
