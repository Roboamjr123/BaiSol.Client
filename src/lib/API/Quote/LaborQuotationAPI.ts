import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../AuthAPI";
import { toast } from "react-toastify";

export interface LaborCost {
  laborId: number;
  description: string;
  quantity: number;
  unit: string;
  unitCost: number;
  unitNum: number;
  totalCost: number;
}

export interface TotalLaborCost {
  totalCost: number;
  profit: number;
  profitPercentage: number;
  overallLaborProjectTotal: number;
}

// Get all installers
export const getLaborCostQuote = (projectId: string) => {
  return useQuery<
    { laborCost: LaborCost[]; totalLaborCost: TotalLaborCost },
    Error
  >({
    queryKey: ["labor-cost-quote", projectId],
    queryFn: async () => {
      const response = await api.get(`api/Quotation/Get-Labor-Cost`, {
        params: { projectId }, // Using params for cleaner query string
      });
      return response.data;
    },
  });
};

interface IAddLaborCost {
  description: string;
  quantity: number;
  unit: string;
  unitCost: number;
  unitNum: number;
  projId: string;
}

export const useAddLaborCost = () => {
  return useMutation({
    mutationFn: async (formData: IAddLaborCost) => {
      const response = await api.post(
        "api/Quotation/Add-Project-Labor",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    onError: (err: any) => {
      toast.error(err.response.data);
    },
  });
};

interface IUpdateLaborCost {
  laborId: number;
  description: string;
  quantity: number;
  unit: string;
  unitCost: number;
  unitNum: number;
}

//Update Labor Cost
export const useUpdateLaborCost = () => {
  return useMutation({
    mutationFn: async (data: IUpdateLaborCost) => {
      const response = await api.put(`api/Quotation/Update-Labor-Quote`, data, {
        headers: {
          "Content-Type": "application/json", // Ensure it matches the server requirements
        },
      });
      return response.data;
    },
  });
};

// Delete Labor Cost
export const useDeleteLaborCost = () => {
  return useMutation({
    mutationFn: async ({ laborId }: { laborId: number }) => {
      try {
        const response = await api.delete("api/Quotation/Delete-Labor-Quote", {
          params: { laborId },
        });
        return response.data;
      } catch (error) {
        toast.error("Failed to delete labor cost.");
        throw error; // Ensure to propagate the error for proper handling
      }
    },
    onSuccess: (data) => {
      toast.success(data);
    },
    onError: (error) => {
      console.error("Error deleting labor cost:", error);
    },
  });
};
