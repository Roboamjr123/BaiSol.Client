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