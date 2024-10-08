import { ChipProps } from "@nextui-org/react";

export const requisition_columns = [
  { name: "DESCRIPTION", uid: "description" },
  { name: "Project", uid: "project" },
  { name: "REQUESTED QUANTITY", uid: "quantity" },
  { name: "QOH", uid: "qoh" },
  { name: "TIMESTAMPS", uid: "timestamps" },
  { name: "USER INVOLVED", uid: "user" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

export const requestStatus = [
  { name: "Approved", uid: "Approved" },
  { name: "OnReview", uid: "OnReview" },
  { name: "Declined", uid: "Declined" },
  { name: "Acknowledged", uid: "Acknowledged" },
];
export const requestStatusColorMap: Record<string, ChipProps["color"]> = {
  Approved: "secondary",
  OnReview: "warning",
  Acknowledged: "success",
  Declined: "danger",
};
