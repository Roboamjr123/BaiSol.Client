import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "./AuthAPI";

export interface IAvailableInstallers {
  installerId: number;
  name: string;
  position: string;
}

export const getAvailableInstallers = () => {
  return useQuery<IAvailableInstallers[], Error>({
    queryKey: ["available-installers"],
    queryFn: async () => {
      const response = await api.get("api/Personnel/Get-Available-Installers");
      return response.data;
    },
  });
};

export const getAssignedInstallers = (projId: string) => {
  return useQuery<IAvailableInstallers[], Error>({
    queryKey: ["assigned-installers"],
    queryFn: async () => {
      const response = await api.get("api/Personnel/Get-Assigned-Installers", {
        params: { projId },
      });
      return response.data;
    },
  });
};

export interface IAvailableFacilitators {
  id: string;
  email: string;
  userName: string;
}

export const getAvailableFacilitators = () => {
  return useQuery<IAvailableFacilitators[], Error>({
    queryKey: ["available-facilitators"],
    queryFn: async () => {
      const response = await api.get(
        "api/Personnel/Get-Available-Facilitators"
      );
      return response.data;
    },
  });
};

export const getAssignedFacilitators = (projId: string) => {
  return useQuery<IAvailableFacilitators, Error>({
    queryKey: ["assigned-facilitators", projId],
    queryFn: async () => {
      const response = await api.get("api/Personnel/Get-Assigned-Facilitator", {
        params: { projId },
      });
      return response.data;
    },
  });
};

interface IAssignInstallers {
  installerId: number[];
  projectId: string;
}

export const useAssignInstallersToProject = () => {
  // const admin = useSelector(selectUser);
  return useMutation({
    mutationFn: async (formData: IAssignInstallers) => {
      const data = {
        ...formData,
        adminEmail: "richardquirante98@gmail.com",
        // adminEmail: admin?.email, // Add adminEmail dynamically
      };

      try {
        const response = await api.post(
          "api/Personnel/Assign-Installers",
          data,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error("Error assigning installlers:", error);
        throw error; // Ensure the error is thrown for react-query to handle
      }
    },
  });
};

interface IAssignFacilitator {
  facilitatorId: string;
  projectId: string;
}

export const useAssignFacilitatorToProject = () => {
  // const admin = useSelector(selectUser);
  return useMutation({
    mutationFn: async (formData: IAssignFacilitator) => {
      const data = {
        ...formData,
        adminEmail: "richardquirante98@gmail.com",
        // adminEmail: admin.email, // Add adminEmail dynamically
      };

      try {
        const response = await api.post(
          "api/Personnel/Assign-Facilitator",
          data,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error("Error assigning facilitator:", error);
        throw error; // Ensure the error is thrown for react-query to handle
      }
    },
  });
};

interface IRemoveInstallers {
  installerIds: number;
  projectId: string;
}

export const removeAssignedInstallerToProject = () => {
  return useMutation({
    mutationFn: async (formData: IRemoveInstallers) => {
      try {
        const response = await api.delete(
          "api/Personnel/Remove-Assigned-Installer",
          {
            headers: {
              "Content-Type": "application/json",
            },
            data: formData, // Use `data` to pass the request body in DELETE request
          }
        );
        return response.data;
      } catch (error) {
        console.error("Error removing installers:", error);
        throw error; // Ensure the error is thrown for react-query to handle
      }
    },
  });
};

interface IRemoveFacilitator {
  facilitatorId: string;
  projectId: string;
}

export const removeAssignedFacilitatorToProject = () => {
  return useMutation({
    mutationFn: async (formData: IRemoveFacilitator) => {
      try {
        const response = await api.delete(
          "api/Personnel/Remove-Assigned-Facilitator",
          {
            headers: {
              "Content-Type": "application/json",
            },
            data: formData, // Use `data` to pass the request body in DELETE request
          }
        );
        return response.data;
      } catch (error) {
        console.error("Error removing facilitator:", error);
        throw error; // Ensure the error is thrown for react-query to handle
      }
    },
  });
};
