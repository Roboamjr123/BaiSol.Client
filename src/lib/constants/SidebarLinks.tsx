import { FaTools } from "react-icons/fa";
import {FaPeopleGroup } from "react-icons/fa6";
import { LuLayers } from "react-icons/lu";
import { RxDashboard } from "react-icons/rx";

export const AdminSidebarLinks = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/",
    icon: <RxDashboard size={23} className="min-w-max" />,
  },
  {
    key: "project",
    label: "Projects",
    path: "/project",
    icon: <LuLayers size={23} className="min-w-max" />,
  },
  {
    key: "personnel",
    label: "Personnel",
    path: "/personnel",
    icon: <FaPeopleGroup  size={23} className="min-w-max" />,
  },
  {
    key: "supply",
    label: "Supply",
    path: "/supply",
    icon: <FaTools size={23} className="min-w-max" />,
  },
];
