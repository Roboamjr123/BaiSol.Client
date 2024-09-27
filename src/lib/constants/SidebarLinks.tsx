import { FaTools } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { LuLayers } from "react-icons/lu";
import { MdOutlinePayments } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { TbReport } from "react-icons/tb";

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
    icon: <FaPeopleGroup size={23} className="min-w-max" />,
  },
  {
    key: "supply",
    label: "Supply",
    path: "/supply",
    icon: <FaTools size={23} className="min-w-max" />,
  },
];

export const FacilitatorSidebarLinks = [
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
    key: "supply",
    label: "Supply",
    path: "/supply",
    icon: <FaTools size={23} className="min-w-max" />,
  },
  {
    key: "report",
    label: "Report",
    path: "/report",
    icon: <TbReport size={23} className="min-w-max" />,
  },
];

export const ClientSidebarLinks = [
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
    key: "quotation",
    label: "Quotation",
    path: "/quotation",
    icon: <TbReport size={23} className="min-w-max" />,
  },
  {
    key: "payment",
    label: "Payment",
    path: "/payment",
    icon: <MdOutlinePayments size={23} className="min-w-max" />,
  },
];
