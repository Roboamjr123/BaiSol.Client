import { ChipProps } from "@nextui-org/react";

export type UserTableProps = {
  id: string;
  email: string;
  userName: string;
  role: string;
  adminEmail: string;
  status: string;
  updatedAt: string;
  createdAt: string;
};

export const admin_columns = [
  { name: "NAME", uid: "name", sortable: true },
  { name: "CREATOR", uid: "creator" },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "TIMESTAMPS", uid: "timestamps" },
  { name: "ACTIONS", uid: "actions" },
];

export const facilitator_columns = [
  { name: "NAME", uid: "name", sortable: true },
  { name: "CREATOR", uid: "creator" },
  { name: "PROJECT", uid: "project" },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "TIMESTAMPS", uid: "timestamps" },
  { name: "ACTIONS", uid: "actions" },
];

export const statusOptions = [
  { name: "Active", uid: "Active" },
  { name: "InActive", uid: "InActive" },
  { name: "Suspended", uid: "Suspended" },
];

export const statusColorMap: Record<string, ChipProps["color"]> = {
  Active: "success",
  InActive: "danger",
  Suspended: "warning",
};
export const INITIAL_VISIBLE_COLUMNS = ["name", "status", "actions"];
export const INITIAL_FACILITATOR_VISIBLE_COLUMNS = ["name", "project", "status", "actions"];

export const iconClasses =
  "text-xl text-default-500 pointer-events-none flex-shrink-0";
