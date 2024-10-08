import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "./AuthAPI";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { selectUser } from "../../state/authSlice";
import { useUserEmail } from "../../state/Hooks/userHook";

export interface IAddEquipment {
  eqptDescript: string;
  eqptPrice: number;
  eqptqoh: number;
  eqptUnit: string;
  eqptCategory: string;
}

// Add new Equipment
export const useAddEquipment = () => {
  const userEmail = useUserEmail();
  return useMutation({
    mutationFn: async (formData: IAddEquipment) => {
      try {
        const response = await api.post(
          "api/Equipment/Add-Equipment",
          {
            ...formData,

            userEmail: userEmail,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error("Error adding equipment:", error);
        throw error; // Ensure the error is thrown for react-query to handle
      }
    },
  });
};

export interface IAllEquipment {
  eqptId: number;
  eqptCode: string;
  eqptDescript: string;
  eqptCtgry: string;
  eqptPrice: number;
  eqptqoh: number;
  eqptUnit: string;
  eqptStatus: string;
  updatedAt: string;
  createdAt: string;
}

// Get all Equipment
export const getAllEquipment = () => {
  return useQuery<IAllEquipment[], Error>({
    queryKey: ["all-equipment"],
    queryFn: async () => {
      const response = await api.get("api/Equipment/Get-Equipment");
      return response.data;
    },
  });
};

interface AvailEquipment {
  eqptId: number;
  code: string;
  description: string;
  quantity: number;
}

// Get available equipment
export const getAvailableEquipment = (projId: string, category: string) => {
  return useQuery<AvailEquipment[], Error>({
    queryKey: ["available-equipment", projId],
    queryFn: async () => {
      const response = await api.get(`api/Equipment/Get-Available-Equipment`, {
        params: { projId, category }, // Using params for cleaner query string
      });
      return response.data;
    },
    enabled: !!projId && !!category,
  });
};

interface ICategory {
  category: string;
}
// Get all equipment categories
export const getEquipmentCategory = () => {
  return useQuery<ICategory[], Error>({
    queryKey: ["equipment-category"],
    queryFn: async () => {
      const response = await api.get(`api/Equipment/Get-Categories`);
      return response.data;
    },
  });
};

interface IUpdatEquipmentPAndQ {
  eqptId: number;
  eqptPrice: number;
  eqptqoh: number;
}

// Update Equipment Price and Quantity
export const useUpdateEquipmentPAndQ = () => {
  const userEmail = useUserEmail();
  return useMutation({
    mutationFn: async (data: IUpdatEquipmentPAndQ) => {
      const response = await api.put(
        `api/Equipment/Update-EquipmentPAndQ`,
        {
          ...data,

          userEmail: userEmail,
        },
        {
          headers: {
            "Content-Type": "application/json", // Ensure it matches the server requirements
          },
        }
      );
      return response.data;
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
      console.error("Error update:", error);
    },
  });
};

interface IUpdateEquipmentUAndD {
  eqptCode: string;
  eqptDescript: string;
  eqptUnit: string;
}

// Update Equipment Unit and Description
export const useUpdateEquipmentUAndD = () => {
  const userEmail = useUserEmail();
  return useMutation({
    mutationFn: async (data: IUpdateEquipmentUAndD) => {
      const response = await api.put(
        `api/Equipment/Update-EquipmentUAndD`,
        {
          ...data,

          userEmail: userEmail,
        },
        {
          headers: {
            "Content-Type": "application/json", // Ensure it matches the server requirements
          },
        }
      );
      return response.data;
    },
  });
};

// Delete Equipment
export const useDeleteEquipment = () => {
  //   const admin = useSelector(selectUser);
  //   const adminEmail = admin?.email;
  const adminEmail = "richardquirante98@gmail.com";

  return useMutation({
    mutationFn: async ({ eqptId }: { eqptId: number }) => {
      try {
        const response = await api.delete("api/Equipment/Delete-Equipment", {
          params: { eqptId, adminEmail },
        });
        return response.data;
      } catch (error) {
        toast.error("Failed to delete equipment.");
        throw error; // Ensure to propagate the error for proper handling
      }
    },
    // onSuccess: (data) => {
    //   toast.success(data);
    // },
    onError: (error) => {
      console.error("Error deleting equipment:", error);
    },
  });
};

// Define the structure for equipment details
interface EquipmentDetail {
  code: string;
  qoh: number; // quantity on hand
  price: number;
}

interface IReturnEquipment {
  projId: string;
  equipmentDetails: EquipmentDetail[];
}

// Return Damage Equipment
export const useReturnDamageEquipment = () => {
  // const admin = useSelector(selectUser);

  return useMutation({
    mutationFn: async (formData: IReturnEquipment) => {
      try {
        const response = await api.post(
          "api/Equipment/Return-Damaged-Equipment",
          {
            ...formData,

            // ,userEmail: admin?.email
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error("Error return equipment:", error);
        throw error; // Ensure the error is thrown for react-query to handle
      }
    },
  });
};

// Return GoodEquipment
export const useReturnGoodquipment = () => {
  // const admin = useSelector(selectUser);

  return useMutation({
    mutationFn: async (formData: IReturnEquipment) => {
      try {
        const response = await api.put(
          "api/Equipment/Return-Good-Equipment",
          {
            ...formData,

            // ,userEmail: admin?.email
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error("Error return equipment:", error);
        throw error; // Ensure the error is thrown for react-query to handle
      }
    },
  });
};

// Get equipment qoh
export const getEquipmentQOH = (eqptId: number) => {
  return useQuery<{ qoh: number }, Error>({
    queryKey: ["equipment-qoh", eqptId],
    queryFn: async () => {
      const response = await api.get(`api/Equipment/Get-Equipment-QOH`, {
        params: { eqptId }, // Using params for cleaner query string
      });
      return response.data;
    },
  });
};
