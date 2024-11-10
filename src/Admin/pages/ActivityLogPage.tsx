import React from "react";
import ActivitityLogs from "../components/log/ActivitityLogs";

const ActivityLogPage = () => {
  return (
    <div>
      <h1 className="flex items-center mb-4 text-lg md:text-xl">Activities</h1>
      <ActivitityLogs />
    </div>
  );
};

export default ActivityLogPage;
