import { FaTools } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { LuLayers } from "react-icons/lu";
import { MdOutlinePayment, MdOutlinePayments } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { TbReport } from "react-icons/tb";
import { getClientProjId } from "../API/Client/ClientProjectAPI";

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
  {
    key: "billing",
    label: "Billing",
    path: "/billing",
    icon: <MdOutlinePayment size={23} className="min-w-max" />,
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

interface SidebarLink {
  key: string;
  label: string;
  path: string;
  icon: JSX.Element;
}

export const getClientSidebarLinks = (clientProjId?: string): SidebarLink[] => [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/",
    icon: <RxDashboard size={23} className="min-w-max" />,
  },
  {
    key: "project",
    label: "Project",
    path: `/project/${clientProjId ?? "73288400-fc5f-4888-96c0-6733c7c3e024"}`, // Use project ID if available
    icon: <LuLayers size={23} className="min-w-max" />,
  },
  {
    key: "quotation",
    label: "Quotation",
    path: `/quotation/${
      clientProjId ?? "73288400-fc5f-4888-96c0-6733c7c3e024"
    }`,
    icon: <TbReport size={23} className="min-w-max" />,
  },
  {
    key: "payment",
    label: "Payment",
    path: `/payment/${clientProjId ?? "73288400-fc5f-4888-96c0-6733c7c3e024"}`,
    icon: <MdOutlinePayments size={23} className="min-w-max" />,
  },
];
