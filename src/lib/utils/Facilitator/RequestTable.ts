import { ChipProps } from "@nextui-org/react";

export const request_columns = [
  { name: "REQUEST SUPPLY", uid: "requestSupply" },
  { name: "SUPPLY CATEGORY", uid: "supplyCategory" },
  { name: "REQUESTED QUANTITY", uid: "quantityRequested" },
  { name: "PROJECT NAME", uid: "projectName" },
  { name: "SUBMITTED BY", uid: "submittedBy" },
  { name: "SUBMITTED AT", uid: "submittedAt" },
  { name: "REVIEWED BY", uid: "reviewedBy" },
  { name: "REVIEWED AT", uid: "reviewedAt" },
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
