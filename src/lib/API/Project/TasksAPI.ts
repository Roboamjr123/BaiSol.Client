import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../AuthAPI";

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

interface IFinishTask {
  ProofImage: File;
}

// Add new project with new client
export const useFinishTask = () => {
  return useMutation({
    mutationFn: async (formData: IFinishTask) => {
      const data = new FormData(); // Create a FormData instance
      data.append("ProofImage", formData.ProofImage); // Append the file

      try {
        const response = await api.post("api/Gantt/FinishTask", data, {
          params: { id: 5 }, // Parameters for the request
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data;
      } catch (error) {
        console.error("Error upload image:", error);
        throw error; // Ensure the error is thrown for react-query to handle
      }
    },
  });
};
