import { useQuery } from "@tanstack/react-query";
import { api } from "./AuthAPI";

export interface IInventoryLog {
  action: string;
  entityName: string;
  userIPAddress: string;
  details: string;
  userName: string;
  userEmail: string;
  timestamp: string;
}

// Get specific inventory history log
export const getInventoryLogs = (supplyCategory: string, id: string) => {
  return useQuery<IInventoryLog[], Error>({
    queryKey: ["inventory-log", supplyCategory, id],
    queryFn: async () => {
      const response = await api.get("api/Logs/GetInventoryLogs", {
        params: { supplyCategory, id },
      });
      return response.data;
    },
  });
};

export interface IActivityLogs {
  logId: number;
  action: string;
  entityName: string;
  userIPAddress: string;
  details: string;
  userName: string;
  userEmail: string;
  userRole: string;
  timestamp: string;
}

// Get specific inventory history log
export const getActivityLogs = () => {
  return useQuery<IActivityLogs[], Error>({
    queryKey: ["activities-log"],
    queryFn: async () => {
      const response = await api.get("api/Logs/GetActivityLogs");
      return response.data;
    },
  });
};
