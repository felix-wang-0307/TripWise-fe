import React, { useState, useEffect, useRef } from "react";
import Navbar from "./components/navBar.tsx";
import ActivityList from "./components/activityList.tsx";
import Loading from "./components/loading.tsx";
// import { mockActivities } from "./mock/mockActivities.ts";
import "./homepage.css";



interface Activity {
  groupId: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  participants: number[];
}

const HomePage: React.FC = () => {

  const userId = "3";  // TODO: userId 后续从 Cookie 读取

  // const [activities, setActivities] = useState(mockActivities);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activeTab, setActiveTab] = useState("ongoing");
  const [loading, setLoading] = useState(true); // for loading the homepage

  // 控制创建和加入活动弹窗显示的状态
  const [showOptions, setShowOptions] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [activityId, setActivityId] = useState("");

  // 创建活动所需的输入状态
  const [newActivityName, setNewActivityName] = useState("");
  const [newActivityDescription, setNewActivityDescription] = useState("");
  const [newActivityStartDate, setNewActivityStartDate] = useState("");
  const [newActivityEndDate, setNewActivityEndDate] = useState("");

  const [isLoading, setIsLoading] = useState(false); // for refreshing the activities lodaing
  const [formErrorMessage, setFormErrorMessage] = useState("");

  // get today's date in ISO format (YYYY-MM-DD)
  const today = new Date().toISOString().split("T")[0];
  // classify activities into ongoing and completed
  const ongoingActivities = activities.filter((activity) => activity?.endDate && activity.endDate >= today);
  const completedActivities = activities.filter((activity) => activity?.endDate && activity.endDate < today);


  const optionsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const addBtnRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  // Function to scroll to the bottom of the page
  const scrollToBottom = () => {
    setTimeout(() => {
      // scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      scrollRef.current?.scrollIntoView({ behavior: "auto" });
    }, 80); // Adding a delay to ensure rendering is complete
  };


  const emptyFormErrors = {
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    activityId: ""
  };
  // 设置 formErrors 状态，使用默认空对象作为初始值
  const [formErrors, setFormErrors] = useState<typeof emptyFormErrors>(emptyFormErrors);


  // 检查表单是否有效 (验证函数)
  const validateForm = () => {
    const errors = { ...formErrors };
    if (showCreateForm) {
      if (!newActivityName) errors.name = "Activity name is required.";
      if (!newActivityDescription) errors.description = "Description is required.";
      if (!newActivityStartDate) errors.startDate = "Start date is required.";
      if (!newActivityEndDate) errors.endDate = "End date is required.";
    }

    // 通过活动 ID 加入的验证
    if (showJoinForm) {
      if (!activityId) errors.activityId = "Activity ID is required.";
    }

    console.log("Validation Errors:", errors); // 调试用，打印验证错误

    setFormErrors(errors);
    return Object.keys(errors).length === 0; // 如果没有错误，返回 true
  };




  // ------------------------------useEffect------------------------------
  // When the options menu is shown, scroll to the bottom
  useEffect(() => {
    if (showOptions) {
      scrollToBottom();
    }
  }, [showOptions]);

  // When the create form is shown, scroll to the bottom
  useEffect(() => {
    if (showCreateForm) {
      scrollToBottom();
    }
  }, [showCreateForm]);

  // When the join form is shown, scroll to the bottom
  useEffect(() => {
    if (showJoinForm) {
      scrollToBottom();
    }
  }, [showJoinForm]);



  // for fetching all activities of user from the server when the page loads
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/travels/users/${userId}`);
        if (!response.ok) {
          if (response.status === 404) {
            console.log("User has no activities");
            setActivities([]);
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched activities:", data.activities);
        console.log("Setting activities to:", data.activities);
        setActivities(data.activities || []);

      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false); // stop loading
      }
    };

    fetchActivities();
  }, []);



  // useEffect to handle all outside clicks
  // useEffect to handle all outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // 如果点击的目标不在任何一个弹窗或按钮内，则关闭所有内容
      if (
        !optionsRef.current?.contains(target) &&
        !formRef.current?.contains(target) &&
        !addBtnRef.current?.contains(target)
      ) {
        setShowOptions(false);
        setShowCreateForm(false);
        setShowJoinForm(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);








  // ------------------------------handle functions------------------------------

  const handleAddButtonClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (showCreateForm || showJoinForm) {
      setShowCreateForm(false);
      setShowJoinForm(false);
      setShowOptions(true);
    } else {
      setShowOptions(!showOptions);
    }
    setActivityId("");
    setNewActivityName("");
    setNewActivityDescription("");
    setNewActivityStartDate("");
    setNewActivityEndDate("");
  };


  // open create activity form
  const handleCreateActivity = () => {
    setShowCreateForm(true);
    setShowJoinForm(false);
    setShowOptions(false);
  };

  // open join activity form
  const handleJoinActivity = () => {
    setShowJoinForm(true);
    setShowCreateForm(false);
    setShowOptions(false);
  };

  const handleCloseForms = () => {
    setShowCreateForm(false);
    setShowJoinForm(false);
    setShowOptions(false);
    setActivityId("");
    setNewActivityName("");
    setNewActivityDescription("");
    setNewActivityStartDate("");
    setNewActivityEndDate("");
    setFormErrors(emptyFormErrors);
    setFormErrorMessage("");
  };

  // clear the form fields
  const handleClearForm = () => {
    setNewActivityName("");
    setNewActivityDescription("");
    setNewActivityStartDate("");
    setNewActivityEndDate("");
    setActivityId("");
    setFormErrors({
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      activityId: ""
    });
    setFormErrorMessage("");
  };

  // deal with the change in the name input field
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewActivityName(e.target.value);
    if (e.target.value) {
      setFormErrors((prev) => ({ ...prev, name: "" }));
    }
  };
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewActivityDescription(e.target.value);
    if (e.target.value) {
      setFormErrors((prev) => ({ ...prev, description: "" }));
    }
  };
  // Handle Start Date change
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const startDate = e.target.value;
    setNewActivityStartDate(startDate);
    // 自动清除错误提示 (Start Date)
    if (startDate) {
      setFormErrors((prev) => ({ ...prev, startDate: "" }));
      // 检查 End Date 是否比 Start Date 小
      if (newActivityEndDate && newActivityEndDate < startDate) {
        setFormErrors((prev) => ({ ...prev, endDate: "End date must be later than start date." }));
      } else {
        setFormErrors((prev) => ({ ...prev, endDate: "" }));
      }
    }
  };
  // Handle End Date change with validation
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const endDate = e.target.value;
    setNewActivityEndDate(endDate);
    // 清除错误提示 (End Date)
    if (endDate) {
      if (newActivityStartDate && endDate < newActivityStartDate) {
        setFormErrors((prev) => ({ ...prev, endDate: "End date must be later than start date." }));
      } else {
        setFormErrors((prev) => ({ ...prev, endDate: "" }));
      }
    }
  };

  const handleActivityIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActivityId(e.target.value);
    // 如果有输入，则清空 activityId 的错误信息
    if (e.target.value) {
      setFormErrors((prev) => ({ ...prev, activityId: "" }));
      setFormErrorMessage("");
    }
  };



  const handleJoinById = async () => {
    if (validateForm()) {
      setIsLoading(true);
      setFormErrorMessage("");
      try {
        const response = await fetch(
          `http://localhost:8080/api/travels/activities/${activityId}?userId=${userId}`
        );

        if (response.status === 200) {
          const data = await response.json();

          // 检查用户是否已经在活动中
          const isAlreadyJoined = data.activity.participants.includes(parseInt(userId, 10));
          if (isAlreadyJoined) {
            setFormErrorMessage("Already joined this activity.");
          } else {
            setActivityId("");
            setShowJoinForm(false);
            handleCloseForms();
            fetchActivities(); // 刷新活动列表
          }
        } else if (response.status === 404) {
          setFormErrorMessage("Activity does not exist.");
        } else {
          setFormErrorMessage("An unexpected error occurred. Please try again.");
        }
      } catch (error) {
        console.error("Error joining activity by ID:", error);
        setFormErrorMessage("Unable to connect to the server. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };





  const handleCreateNewActivity = async () => {
    if (validateForm()) {
      setIsLoading(true);
      setFormErrorMessage("");
      try {
        const response = await fetch("http://localhost:8080/api/travels", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            name: newActivityName,
            description: newActivityDescription,
            startDate: newActivityStartDate,
            endDate: newActivityEndDate,
          }),
        });

        if (response.status === 201) {
          // activity created successfully
          setNewActivityName("");
          setNewActivityDescription("");
          setNewActivityStartDate("");
          setNewActivityEndDate("");
          setShowCreateForm(false);
          handleCloseForms();
          fetchActivities(); // refresh activities
        } else {
          // failed to create activity
          const errorData = await response.json();
          setFormErrorMessage(errorData.error || "Failed to create activity. Please try again.");
        }
      } catch (error) {
        console.error("Error creating activity:", error);
        setFormErrorMessage("An error occurred while creating the activity. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };


  // Fetch activities from the server after add the new activity
  const fetchActivities = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/travels/users/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setActivities(data.activities || []);
      } else {
        console.error("Failed to fetch activities:", response.status);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };


  //################
  const handleDeleteActivity = async (activityId: number) => { // Todo: Fail to delete activity
    console.log("Deleting activity with ID:", activityId); // 检查 activityId 是否正确
    try {
      const response = await fetch(
        `http://localhost:8080/api/travels/activities/${activityId}/users/${userId}`,
        {
          method: "DELETE"
        }

      );
      if (response.ok) {
        alert("Activity deleted successfully.");
        fetchActivities(); // 刷新活动列表
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error deleting activity:", error);
      alert("Unable to connect to the server.");
    }
  };










  return (
    <div>
      <Navbar />


      {/* Tabs */}
      <div className="container mt-4">
        {/* <ul className="nav nav-tabs custom-tabs justify-content-center"> */}
        <ul className="nav nav-tabs custom-tabs">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "ongoing" ? "active" : ""}`}
              onClick={() => setActiveTab("ongoing")}
            >
              Ongoing
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "completed" ? "active" : ""}`}
              onClick={() => setActiveTab("completed")}
            >
              Completed
            </button>
          </li>
        </ul>



        {/* Tab Content */}
        {/* Loading */}
        {loading ? (
          <Loading />
        ) : (
          // Tab Content
          <div className="mt-3">
            {activeTab === "ongoing" ? (
              <>
                <ActivityList
                  activities={ongoingActivities}
                  onDeleteActivity={handleDeleteActivity}
                />



                {/* + button, only show in ongoing tab */}
                <div className="d-flex justify-content-center mt-3">
                  <button
                    className="add-activity-btn"
                    onClick={handleAddButtonClick}
                    ref={addBtnRef}
                  >
                    ＋
                  </button>
                </div>



                {/* option menu */}
                {showOptions && (
                  <div className="options-menu" ref={optionsRef}>
                    <button className="option-btn" onClick={handleCreateActivity}>
                      Create New Activity
                    </button>
                    <button className="option-btn" onClick={handleJoinActivity}>
                      Join by Activity ID
                    </button>
                  </div>
                )}



                {/* Create Form */}
                {showCreateForm && (
                  <div className="form-container" ref={formRef}>
                    <button className="close-btn" onClick={handleCloseForms}>✖</button>
                    <div className="form-header">
                      <h3>Create New Activity</h3>
                    </div>

                    <input
                      type="text"
                      placeholder="Activity Name"
                      value={newActivityName}
                      onChange={handleNameChange}
                      className={formErrors.name ? "input-error" : ""}
                    />
                    {formErrors.name && <span className="error-text">{formErrors.name}</span>}

                    <input
                      type="text"
                      placeholder="Description"
                      value={newActivityDescription}
                      onChange={handleDescriptionChange}
                      className={formErrors.description ? "input-error" : ""}
                    />
                    {formErrors.description && <span className="error-text">{formErrors.description}</span>}

                    {/* Start Date Input */}
                    <input
                      type="date"
                      placeholder="Start Date"
                      value={newActivityStartDate}
                      onChange={handleStartDateChange}
                      className={formErrors.startDate ? "input-error" : ""}
                    />
                    {formErrors.startDate && <span className="error-text">{formErrors.startDate}</span>}

                    {/* End Date Input with validation */}
                    <input
                      type="date"
                      placeholder="End Date"
                      value={newActivityEndDate}
                      onChange={handleEndDateChange}
                      className={formErrors.endDate ? "input-error" : ""}
                      min={newActivityStartDate || ""} // 设置最小值为 Start Date
                    />
                    {formErrors.endDate && <span className="error-text">{formErrors.endDate}</span>}

                    <div className="button-group">
                      <button className="create-btn" onClick={handleCreateNewActivity} disabled={isLoading}>
                        {isLoading ? "Creating..." : "Create"}
                      </button>

                      <button className="clear-btn" onClick={handleClearForm}>
                        Clear
                      </button>
                    </div>
                    {/* ❌ backend error */}
                    {formErrorMessage && <span className="error-text form-error">{formErrorMessage}</span>}
                  </div>
                )}



                {/* Join Form */}
                {showJoinForm && (
                  <div className="form-container" ref={formRef}>
                    <button className="close-btn" onClick={handleCloseForms}>✖</button>
                    <div className="form-header">
                      <h3>Join Activity by ID</h3>
                    </div>

                    <input
                      type="text"
                      placeholder="Enter Activity ID"
                      value={activityId}
                      onChange={handleActivityIdChange}
                      className={formErrors.activityId ? "input-error" : ""}
                    />
                    {formErrors.activityId && <span className="error-text">{formErrors.activityId}</span>}

                    <div className="button-group">
                      <button className="join-btn" onClick={handleJoinById} disabled={isLoading}>
                        {isLoading ? "Joining..." : "Join"}
                      </button>
                      <button className="clear-btn" onClick={handleClearForm}>
                        Clear
                      </button>
                    </div>

                    {/* ❌ backend error */}
                    {formErrorMessage && (
                      <span
                        className={`error-text form-error ${formErrorMessage === "Already joined this activity." ? "text-success" : "text-danger"
                          }`}
                      >
                        {formErrorMessage}
                      </span>
                    )}
                  </div>
                )}



              </>
            ) : (
              <ActivityList
                activities={completedActivities}
                onDeleteActivity={handleDeleteActivity}
              />
            )}
          </div>
        )}
        <div ref={scrollRef}></div>


      </div>
    </div>
  );
};

export default HomePage;
