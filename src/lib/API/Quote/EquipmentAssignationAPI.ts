import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../AuthAPI";
import { toast } from "react-toastify";
import { useUserEmail } from "../../../state/Hooks/userHook";

// const userEmail = useSelector(selectUser);

export interface IAssignedEquipmentDetails {
  suppId: number;
  eqptId: number;
  eqptCode: string;
  eqptDescript: string;
  eqptPrice: number;
  eqptqoh: number;
  eqptUnit: string;
}
export interface IAssignedEquipment {
  eqptCategory: string;
  details: IAssignedEquipmentDetails[];
}

// Get all assigned equipment
export const getAssignedEquipment = (projectId: string) => {
  return useQuery<IAssignedEquipment[], Error>({
    queryKey: ["assigned-equipment", projectId],
    queryFn: async () => {
      const response = await api.get("api/Quotation/Get-Assigned-Equipment", {
        params: { projectId },
      });
      return response.data;
    },
  });
};

interface IAssignEquipment {
  eqptId: number;
  eqptQuantity: number;
  projId: string;
}

// Assign new equipment
export const useAssignEquipment = () => {
  const userEmail = useUserEmail();
  return useMutation({
    mutationFn: async (formData: IAssignEquipment) => {
      const response = await api.post(
        "api/Quotation/Assign-Equipment",
        {
          ...formData,
          // userEmail: "richardquirante98@gmail.com",
          userEmail: userEmail,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    },
    onError: (error: any) => {
      toast.error(error.response.data);
      console.error("Error assigning equipment:", error);
    },
  });
};

interface IUpdateEquipment {
  suppId: number;
  eqptId: number;
  quantity: number;
}

// Update assigned equipment
export const useUpdateEquipmentAssigned = () => {
  const userEmail = useUserEmail();
  return useMutation({
    mutationFn: async (data: IUpdateEquipment) => {
      const response = await api.put(
        "api/Quotation/Update-Equipment-Quantity",
        {
          ...data,
          // userEmail: "richardquirante98@gmail.com",
          userEmail: userEmail,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    onError: (error: any) => {
      toast.error(error.response.data);
      console.error("Error update equipment:", error);
    },
  });
};

interface IDeleteEquipment {
  suppId: number;
  eqptId: number;
}

// Delete assigned equipment
export const useDeleteAssignedEquipment = () => {
  const userEmail = useUserEmail();
  return useMutation({
    mutationFn: async (data: IDeleteEquipment) => {
      const response = await api.delete(
        "api/Quotation/Delete-EQuipment-Supply",
        {
          data: {
            ...data,
            // userEmail: "richardquirante98@gmail.com",
            userEmail: userEmail, // Uncomment if using a dynamic userEmail variable
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    },
  });
};
