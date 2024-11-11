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
  currentProjId: string;
  clientProjects: [{ projId: string }];
};

export type InstallerTableProps = {
  installerId: number;
  name: string;
  position: string;
  status: string;
  assignedProj: string;
  adminEmail: string;
  updatedAt: string;
  createdAt: string;
  
  assignedProjects: [{ projId: string }];
};

export type ClientTableProps = {
  id: string;
  email: string;
  userName: string;
  adminEmail: string;
  status: string;
  updatedAt: string;
  createdAt: string;
  ClientContactNum: string;
  clientAddress: string;
  clientMonthlyElectricBill: number;
  currentProjId: string;
  clientProjects: [{ projId: string }];
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

export const client_columns = [
  { name: "NAME", uid: "name", sortable: true },
  { name: "CREATOR", uid: "creator" },
  { name: "PROJECT", uid: "project", sortable: true },
  { name: "DETAILS", uid: "details" },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "TIMESTAMPS", uid: "timestamps" },
  { name: "ACTIONS", uid: "actions" },
];

export const statusOptions = [
  { name: "Active", uid: "Active" },
  { name: "InActive", uid: "InActive" },
  { name: "Suspended", uid: "Suspended" },
  { name: "OnWork", uid: "OnWork" },
];

export const statusColorMap: Record<string, ChipProps["color"]> = {
  Active: "success",
  InActive: "danger",
  Suspended: "warning",
  OnWork: "secondary",
};

export const clientStatusOptions = [
  { name: "Active", uid: "Active" },
  { name: "OnGoing", uid: "OnGoing" },
  { name: "Finished", uid: "Finished" },
  { name: "Pending", uid: "Pending" },
];

export const clientStatusColorMap: Record<string, ChipProps["color"]> = {
  Active: "success",
  OnGoing: "primary",
  Finished: "secondary",
  Pending: "default"
};

export const INITIAL_VISIBLE_COLUMNS = ["name", "status", "actions"];
export const INITIAL_FACILITATOR_VISIBLE_COLUMNS = [
  "name",
  "project",
  "status",
  "actions",
];

export const INITIAL_INSTALLER_VISIBLE_COLUMNS = [
  "name",
  "project",
  "status",
  "actions",
];
export const INITIAL_CLIENT_VISIBLE_COLUMNS = [
  "name",
  "project",
  "status",
  "details",
  "actions",
];

export const iconClasses =
  "text-xl text-default-500 pointer-events-none flex-shrink-0";

export const installer_columns = [
  { name: "NAME", uid: "name", sortable: true },
  { name: "CREATOR", uid: "creator" },
  { name: "PROJECT", uid: "project", sortable: true },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "TIMESTAMPS", uid: "timestamps" },
  { name: "ACTIONS", uid: "actions" },
];
