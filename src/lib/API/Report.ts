import { useQuery } from "@tanstack/react-query";
import { api } from "./AuthAPI";

export interface IAllProjectTasks {
  id: number;
  projId?: string;
  taskName?: string;
  plannedStartDate?: string;
  plannedEndDate?: string;
  startDate?: string;
  endDate?: string;
  startProofImage?: string;
  finishProofImage?: string;
  isFinished?: boolean;
  facilitatorName?: string;
  facilitatorEmail?: string;
}

export const getAllProjectTasksReport = () => {
  return useQuery<IAllProjectTasks[], Error>({
    queryKey: ["AllProjectTasksReport"],
    queryFn: async () => {
      const response = await api.get("api/Report/AllProjectTasksReport");
      return response.data;
    },
  });
};

interface TaskCount {
  allTasks: number;

  finishedTasks: number;
}

interface ProjectCount {
  allProject: number;
  finishedProject: number;
}

export interface ReportCounts {
  taskCount: TaskCount;
  projectCount: ProjectCount;
}

export const getTasksAndProjectCounts = () => {
  return useQuery<ReportCounts, Error>({
    queryKey: ["TasksAndProjectCounts"],
    queryFn: async () => {
      const response = await api.get("api/Report/TasksAndProjectCounts");
      return response.data;
    },
  });
};

export interface IMaterialReport {
  suppId: number;
  mtlQuantity: number;
  assignedPrice: string; // Price as a string (formatted as currency)
  projId: string; // UUID as string
  mtlCode: string; // UUID as string
  mtlDescript: string; // Material description
  currentPrice: string; // Price as a string (formatted as currency)
  mtlqoh: number; // Quantity on hand
  mtlUnit: string; // Unit of measure (e.g., "pcs")
  mtlCategory: string; // Category of the material
  updatedAt: string; // Date string (e.g., "Nov 07, 2024")
  createdAt: string; // Date string (e.g., "Nov 07, 2024")
}

export const getAllMaterialReport = () => {
  return useQuery<IMaterialReport[], Error>({
    queryKey: ["AllMaterialReport"],
    queryFn: async () => {
      const response = await api.get("api/Report/AllMaterialReport");
      return response.data;
    },
  });
};

export interface IEquipmentReport {
  suppId: number;
  eqptQuantity: number;
  assignedPrice: string; // Price as a string (formatted as currency)
  projId: string; // UUID as string
  eqptCode: string; // UUID as string
  eqptDescript: string; // Equipment description
  currentPrice: string; // Price as a string (formatted as currency)
  eqptqoh: number; // Quantity on hand
  eqptUnit: string; // Unit of measure (e.g., "pcs")
  eqptCategory: string; // Category of the equipment
  updatedAt: string; // Date string (e.g., "Nov 07, 2024")
  createdAt: string; // Date string (e.g., "Nov 07, 2024")
}

export const getAllEquipmentReport = () => {
  return useQuery<IEquipmentReport[], Error>({
    queryKey: ["AllEquipmentReport"],
    queryFn: async () => {
      const response = await api.get("api/Report/AllEquipmentReport");
      return response.data;
    },
  });
};

export interface IDashboardDTO {
  totalPersonnel: number;
  finishedProjects: number;
  pendingProjects: number;
  onWorkProjects: number;
}

export const getDashboardData = () => {
  return useQuery<IDashboardDTO, Error>({
    queryKey: ["DashboardData"],
    queryFn: async () => {
      const response = await api.get("api/Report/DashboardData");
      return response.data;
    },
  });
};

export interface IProjectDTO {
  projId: string;
  kWCapacity: string;
  systemType: string;
  customer: string;
  facilitator: string;
  plannedStarted: string;
  plannedEnded: string;
  plannedWorkingDays: string;
  actualStarted: string;
  actualEnded: string;
  actualdWorkingDays: string;
  cost: string;
  status: string;
}
export const getAllProjectReport = () => {
  return useQuery<IProjectDTO[], Error>({
    queryKey: ["AllProjectReport"],
    queryFn: async () => {
      const response = await api.get("api/Report/AllProjectReport");
      return response.data;
    },
  });
};
