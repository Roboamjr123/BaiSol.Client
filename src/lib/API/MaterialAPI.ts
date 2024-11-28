import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "./AuthAPI";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { selectUser } from "../../state/authSlice";
import { useUserEmail } from "../../state/Hooks/userHook";

// Get material qoh
export const getMaterialQOH = (mtlId: number) => {
  return useQuery<{ qoh: number }, Error>({
    queryKey: ["material-qoh", mtlId],
    queryFn: async () => {
      const response = await api.get(`material/Material/Get-Material-QOH`, {
        params: { mtlId }, // Using params for cleaner query string
      });
      return response.data;
    },
  });
};

interface Category {
  category: string;
}
// Get all material categories
export const getMaterialCategory = () => {
  return useQuery<Category[], Error>({
    queryKey: ["material-category"],
    queryFn: async () => {
      const response = await api.get(`material/Material/Get-Categories`);
      return response.data;
    },
  });
};

export interface AvailMaterials {
  mtlId: number;
  code: string;
  description: string;
  quantity: number;
}

// Get available material
export const getAvailableMaterials = (projId: string, category: string) => {
  return useQuery<AvailMaterials[], Error>({
    queryKey: ["available-material", projId],
    queryFn: async () => {
      const response = await api.get(
        `material/Material/Get-Available-Materials`,
        {
          params: { projId, category }, // Using params for cleaner query string
        }
      );
      return response.data;
    },
    enabled: !!projId && !!category,
  });
};

export interface IAddMaterial {
  mtlDescript: string;
  mtlPrice: number;
  mtlqoh: number;
  mtlCategory: string;
  mtlUnit: string;
}

// Add new Material
export const useAddMaterial = () => {
  const userEmail = useUserEmail();
  return useMutation({
    mutationFn: async (formData: IAddMaterial) => {
      try {
        const response = await api.post(
          "material/Material/Add-Material",
          {
            ...formData,
            userEmail: userEmail,
            // userEmail: userEmail,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error("Error adding material:", error);
        throw error; // Ensure the error is thrown for react-query to handle
      }
    },
    onError: (err: any) => {
      toast.error(err.response.data);
    },
  });
};

export interface IAllMaterials {
  mtlId: number;
  mtlCode: string;
  mtlDescript: string;
  mtlCtgry: string;
  mtlPrice: number;
  mtlqoh: number;
  mtlUnit: string;
  mtlStatus: string;
  updatedAt: string;
  createdAt: string;
}

// Get materials
export const getAllMaterials = () => {
  return useQuery<IAllMaterials[], Error>({
    queryKey: ["all-materials"],
    queryFn: async () => {
      const response = await api.get("material/Material/Get-Materials");
      return response.data;
    },
  });
};

interface IUpdateMaterialQOH {
  mtlId: number;
  mtlPrice: number;
} 

// Update Material Price and Quantity
export const useUpdateMaterialQOH = () => {
  const userEmail = useUserEmail();
  return useMutation({
    mutationFn: async (data: IUpdateMaterialQOH) => {
      const response = await api.put(
        `material/Material/Update-QOH-Material`,
        {
          ...data,
          userEmail: userEmail,
          // userEmail: userEmail,
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

interface IUpdateMaterialPAndQ {
  mtlId: number;
  mtlPrice: number;
  mtlqoh: number;
}

// Update Material Price and Quantity
export const useUpdateMaterialPAndQ = () => {
  const userEmail = useUserEmail();
  return useMutation({
    mutationFn: async (data: IUpdateMaterialPAndQ) => {
      const response = await api.put(
        `material/Material/Update-MaterialPAndQ`,
        {
          ...data,
          userEmail: userEmail,
          // userEmail: userEmail,
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

interface IUpdateMaterialUAndD {
  mtlCode: string;
  mtlDescript: string;
  mtlUnit: string;
}

// Update Material Unit and Description
export const useUpdateMaterialUAndD = () => {
  const userEmail = useUserEmail();
  return useMutation({
    mutationFn: async (data: IUpdateMaterialUAndD) => {
      const response = await api.put(
        `material/Material/Update-MaterialUAndD`,
        {
          ...data,
          userEmail: userEmail,
          // userEmail: userEmail,
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

// Delete Material
export const useDeleteMaterial = () => {
  const adminEmail = useUserEmail();

  return useMutation({
    mutationFn: async ({ mtlId }: { mtlId: number }) => {
      const response = await api.delete("material/Material/Delete-Material", {
        params: { mtlId, adminEmail },
      });
      return response.data;
    },
    onError: (error: any) => {
      toast.error(error.response.data);
      console.error("Error deleting material:", error);
    },
  });
};
