import React from "react";
import { useLocation } from "react-router-dom";

const NotificationInfoPage = () => {
  const location = useLocation();
  const { notification } = location.state || {}; // Accessing the passed notification data

  if (!notification) {
    return <div>No notification data found</div>; // Handle if no notification is passed
  }

  return <div>NotificationInfoPage</div>;
};

export default NotificationInfoPage;
