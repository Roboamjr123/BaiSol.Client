import React, { useEffect, useState } from "react";
import ActivitityLogs from "../components/log/ActivitityLogs";
import { useParams } from "react-router-dom";
import Loader from "../../main/components/Loader";

const ActivityLogPage = () => {
  const { userEmail } = useParams<{ userEmail: string }>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate an async operation to "fetch" userEmail (or any other logic you need)
    if (userEmail) {
      setLoading(false); // Stop loading once userEmail is available
    } else {
      setLoading(false); // Stop loading if no userEmail is passed
    }
  }, [userEmail]);

  if (loading) {
    return <Loader />; // You can replace this with a spinner or placeholder
  }

  return (
    <div>
      <h1 className="flex items-center mb-4 text-lg md:text-xl">Activities</h1>
      <ActivitityLogs userEmail={userEmail} />
    </div>
  );
};

export default ActivityLogPage;
