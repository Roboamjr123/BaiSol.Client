import React from "react";
import ActivitityLogs from "../components/log/ActivitityLogs";
import { useParams } from "react-router-dom";

const ActivityLogPage = () => {
  const { userEmail } = useParams<{ userEmail: string }>();

  return (
    <div>
      <h1 className="flex items-center mb-4 text-lg md:text-xl">Activities</h1>
      <ActivitityLogs userEmail={userEmail} />
    </div>
  );
};

export default ActivityLogPage;
