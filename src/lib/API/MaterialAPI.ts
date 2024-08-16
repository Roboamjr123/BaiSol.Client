import { useQuery } from "@tanstack/react-query";
import { api } from "./AuthAPI";

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
