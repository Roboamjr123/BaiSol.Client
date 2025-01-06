import { useQuery } from "@tanstack/react-query";
import { api } from "../AuthAPI";

export interface IProjectDateInto {
  startDate: string;
  endDate: string;
  estimatedStartDate: string;
  estimatedEndDate: string;
  assignedFacilitator: string;
  estimatedProjectDays: string;
}

export const getProjectDateInto = (projId: string) => {
  return useQuery<IProjectDateInto, Error>({
    queryKey: ["ProjectDateInto", projId],
    queryFn: async () => {
      const response = await api.get("api/Gantt/ProjectDateInfo", {
        params: {
          projId: projId,
        },
      });
      return response.data;
    },
  });
};

interface IProjectProgress {
  progress: number;
}

export const getProjectProgress = (projId: string) => {
  return useQuery<IProjectProgress, Error>({
    queryKey: ["ProjectProgress", projId],
    queryFn: async () => {
      const response = await api.get("api/Gantt/ProjectProgress", {
        params: {
          projId: projId,
        },
      });
      return response.data;
    },
  });
};

export interface ProjectTasks {
  id: number;
  taskName?: string;
  plannedStartDate?: string;
  plannedEndDate?: string;
  startDate?: string;
  endDate?: string;
  startProofImage?: string;
  finishProofImage?: string;
  isFinished?: boolean;
}

export interface ProjectDateInfo {
  startDate: string;
  endDate: string;
  estimatedStartDate: string;
  estimatedEndDate: string;
  assignedFacilitator: string;
  estimatedProjectDays: string;
}

export interface IProjectStatus {
  info?: ProjectDateInfo;
  tasks?: ProjectTasks[];
}

export const getProjectStatus = (projId: string) => {
  return useQuery<IProjectStatus, Error>({
    queryKey: ["ProjectStatus", projId],
    queryFn: async () => {
      const response = await api.get("api/Gantt/ProjectStatus", {
        params: {
          projId: projId,
        },
      });
      return response.data;
    },
  });
};

export interface IActualWorkDate {
  actualStartDate: string;
  actualEndDate: string;
  actualProjectDays: string;
}

export const getProjectActualWorkedDate = (projId: string) => {
  return useQuery<IActualWorkDate, Error>({
    queryKey: ["ProjectActualWorkedDate", projId],
    queryFn: async () => {
      const response = await api.get("api/Gantt/ProjectActualWorkedDate", {
        params: {
          projId: projId,
        },
      });
      return response.data;
    },
  });
};
