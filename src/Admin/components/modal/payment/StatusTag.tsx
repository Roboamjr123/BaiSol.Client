import React from "react";

interface StatusTagProps {
  status: "paid" | "unpaid"; // Add more statuses as needed
}

const StatusTag: React.FC<StatusTagProps> = ({ status }) => {
  const statusStyles = {
    paid: "bg-green-400 text-white",
    unpaid: "bg-yellow-400 text-white",
  };

  return (
    <span className={`ant-tag ${statusStyles[status]} px-3 py-1 rounded-md`}>
      {status}
    </span>
  );
};

export default StatusTag;