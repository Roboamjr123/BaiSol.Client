import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../AuthAPI";
import { useUserEmail } from "../../../state/Hooks/userHook";
import { toast } from "react-toastify";

interface Subtask {
  id: number;
  taskId: number;
  taskName?: string; // Optional (nullable) string
  startDate?: Date; // Optional (nullable) Date
  endDate?: Date; // Optional (nullable) Date
  subtasks?: Subtask[]; // Optional list of subtasks, allowing for nested subtasks
}

interface FacilitatorTasksDTO {
  id: number;
  taskId: number;
  taskName?: string; // Optional (nullable) string
  startDate?: Date; // Optional (nullable) Date
  endDate?: Date; // Optional (nullable) Date
  progress?: number; // Optional (nullable) number
  projId?: string; // Optional (nullable) string
  subtasks?: Subtask[]; // Optional list of subtasks
}

// fetch all project
export const getTasksByProject = (projId: string) => {
  return useQuery<FacilitatorTasksDTO[], Error>({
    queryKey: ["facilitator-project-tasks", projId],
    queryFn: async () => {
      const response = await api.get("api/Gantt/FacilitatorTasks", {
        params: { projId },
      });
      return response.data;
    },
  });
};

export interface ITaskToDo {
  id: number;
  taskName: string;
  plannedStartDate: string;
  plannedEndDate: string;
  startDate: string;
  endDate: string;
  isEnable: boolean;
  isFinished: boolean;
  isStarting: boolean;
}

export const getTasksToDo = (projId: string) => {
  return useQuery<ITaskToDo[], Error>({
    queryKey: ["facilitator-tasks-to-do", projId],
    queryFn: async () => {
      const response = await api.get("api/Gantt/TasksToDo", {
        params: { projId },
      });
      return response.data;
    },
  });
};

export interface ITaskItem {
  id: number;
  proofImage: string | null;
  actualStart: string;
  estimationStart: string;
  taskProgress: number;
  isFinish: boolean;
  isEnable: boolean;
  isLate: boolean;
  daysLate: number;
}

export interface ITask {
  id: number;
  taskName: string;
  plannedStartDate: string;
  plannedEndDate: string;
  startDate: string;
  endDate: string;
  isEnable: boolean;
  isFinished: boolean;
  isStarting: boolean;
  daysLate: number;
  taskList: ITaskItem[];
}

export const getTaskToDo = (projId: string) => {
  return useQuery<ITask[], Error>({
    queryKey: ["facilitator-task-to-do", projId],
    queryFn: async () => {
      const response = await api.get("api/Gantt/TaskToDo", {
        params: { projId },
      });
      return response.data;
    },
  });
};

export const getTaskToUpdateProgress = (projId: string) => {
  return useQuery<ITask[], Error>({
    queryKey: ["facilitator-task-to-update", projId],
    queryFn: async () => {
      const response = await api.get("api/Gantt/TaskToUpdateProgress", {
        params: { projId },
      });
      return response.data;
    },
  });
};

export interface IActionTask {
  ProofImage: File;
}

// Hook to start a task with an ID parameter
export const useStartTask = () => {
  const userEmail = useUserEmail();

  return useMutation({
    mutationFn: async ({
      id,
      ProofImage,
    }: {
      id: number;
      ProofImage: File;
    }) => {
      const data = new FormData(); // Create a FormData instance
      data.append("ProofImage", ProofImage); // Append the file

      try {
        const response = await api.post("api/Gantt/StartTask", data, {
          params: { id }, // Pass the ID as a query parameter
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data;
      } catch (error) {
        console.error("Error uploading image:", error);
        throw error; // Ensure the error is thrown for react-query to handle
      }
    },
  });
};
// Add new project with new client
export const useFinishTask = () => {
  const userEmail = useUserEmail();
  return useMutation({
    mutationFn: async ({
      id,
      ProofImage,
    }: {
      id: number;
      ProofImage: File;
    }) => {
      const data = new FormData(); // Create a FormData instance
      data.append("ProofImage", ProofImage); // Append the file

      try {
        const response = await api.post("api/Gantt/FinishTask", data, {
          params: { id }, // Pass the ID as a query parameter
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data;
      } catch (error) {
        console.error("Error uploading image:", error);
        throw error; // Ensure the error is thrown for react-query to handle
      }
    },
  });
};

export const useUpdateTaskProgress = () => {
  return useMutation({
    mutationFn: async ({
      id,
      Progress,
      ProofImage,
      EstimationStart,
    }: {
      id: number;
      Progress: number;
      ProofImage: File;
      EstimationStart: string;
    }) => {
      const data = new FormData(); // Create a FormData instance
      data.append("ProofImage", ProofImage); // Append the file

      const response = await api.put("api/Gantt/UpdateTaskProgress", data, {
        params: { id, Progress, EstimationStart }, // Pass the ID as a query parameter
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onError: (error: any) => {
      toast.error(error.response.data);
      console.error("Error submit report:", error);
    },
  });
};

export const useSubmitTaskReport = () => {
  return useMutation({
    mutationFn: async ({
      id,
      ProofImage,
    }: {
      id: number;
      ProofImage: File;
    }) => {
      const data = new FormData(); // Create a FormData instance
      data.append("ProofImage", ProofImage); // Append the file

      const response = await api.post("api/Gantt/SubmitTaskReport", data, {
        params: { id }, // Pass the ID as a query parameter
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
      console.error("Error submit report:", error);
    },
  });
};
