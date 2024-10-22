import React from "react";
import Gantt from "../components/gantt/Gantt";

const Scheduler: React.FC<{ isOnGoing: boolean; isPayedDown: boolean }> = ({
  isOnGoing,
  isPayedDown,
}) => {
  if (!isOnGoing && !isPayedDown) {
    return <>Project is upcoming and not yet paid down...</>; // Message for upcoming projects
  }

  if (isOnGoing && !isPayedDown) {
    return <>Payment is pending for the ongoing project...</>; // Message for ongoing projects with pending payment
  }

  if (!isOnGoing && isPayedDown) {
    return <Gantt />; // Show Gantt chart for ongoing projects with payment completed
  }

  return <>Invalid project state.</>; // Fallback for unexpected states

  
};

export default Scheduler;
