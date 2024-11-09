import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../AuthAPI";
import { useSelector } from "react-redux";
import { selectUser } from "../../../state/authSlice";
import { toast } from "react-toastify";
import {
  useClientUserEmail,
  useUserEmail,
} from "../../../state/Hooks/userHook";

interface Project {
  projId: string; // UUID format
  projName: string; // Name of the project
  projDescript: string; // Description of the project
  status: "OnGoing" | "Completed" | "Pending"; // Status of the project
  updatedAt: string; // Date in string format
  createdAt: string; // Date in string format
  clientId: string; // UUID format
  clientName: string; // Name of the client
  clientAddress: string; // Address of the client
}
// fetch all projects
export const getAllClientsProjects = () => {
  return useQuery<Project[], Error>({
    queryKey: ["all-projects"],
    queryFn: async () => {
      const response = await api.get("api/Project/Get-All-Projects");
      return response.data;
    },
  });
};

// Check project status
export const getIsOnGoingProject = (projId: string) => {
  return useQuery<boolean, Error>({
    queryKey: ["IsProjectOnGoing", projId],
    queryFn: async () => {
      const response = await api.get("api/Project/IsProjectOnGoing", {
        params: {
          projId: projId,
        },
      });
      return response.data;
    },
  });
};

// Check project status
export const getIsOnProcessProject = (projId: string) => {
  return useQuery<boolean, Error>({
    queryKey: ["IsProjectOnProcess", projId],
    queryFn: async () => {
      const response = await api.get("api/Project/IsProjectOnProcess", {
        params: {
          projId: projId,
        },
      });
      return response.data;
    },
  });
};

interface AvailableClients {
  clientId: string;
  clientEmail: string;
}
// fetch all available clients
export const getAllAvailableClients = () =>
  useQuery<AvailableClients[], Error>({
    queryKey: ["all-clients"],
    queryFn: () =>
      api.get("user/User/Available-Clients").then((res) => res.data),
  });

interface existingClientData {
  projName: string;
  projDescript: string;
  clientId: string;
}

// Add new project with existing client
export const useAddNewProjectExistClient = () => {
  return useMutation({
    mutationFn: async (formData: existingClientData) => {
      try {
        const { data } = await api.post(
          "api/Project/Add-Client-Project",
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        return data;
      } catch (error) {
        console.error("Error adding project:", error);
        throw error; // Ensure the error is thrown for react-query to handle
      }
    },
  });
};

interface NewClientData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  clientContactNum: string;
  clientAddress: string;
  clientMonthlyElectricBill: number;
  projName: string;
  projDescript: string;
}

// Add new project with new client
export const useAddNewProjectNewClient = () => {
  // const admin = useSelector(selectUser);
  return useMutation({
    mutationFn: async (formData: NewClientData) => {
      const data = {
        ...formData,
        adminEmail: "richardquirante98@gmail.com",
        // adminEmail: admin.email, // Add adminEmail dynamically
      };

      try {
        const response = await api.post("user/User/Register-Client", data, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        return response.data;
      } catch (error) {
        console.error("Error adding project:", error);
        throw error; // Ensure the error is thrown for react-query to handle
      }
    },
  });
};

export interface IProjectInfo {
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  projectId: string;
  projectDescription: string;
  projectDateCreation: string;
  projectDateValidity: string;
}

// Fetch all project info
export const getProjectInfo = (projId?: string) => {
  const customerEmail = useClientUserEmail();
  return useQuery<IProjectInfo, Error>({
    queryKey: ["project-info", projId, customerEmail],
    queryFn: () =>
      api
        .get("api/Project/ProjectQuotationInfo", {
          params: { projId, customerEmail },
        })
        .then((res) => res.data),
  });
};

export interface IClientProjectInfo {
  projId: string;
  projName: string;
  projDescript: string;
  discount: number;
  vatRate: number;
  clientId: string;
  clientFName: string;
  clientLName: string;
  clientContactNum: string;
  clientAddress: string;
  systemType: string;
  kWCapacity: number;
  sex: string;
  isMale: boolean;
  paymentProgress?: number;
  projectProgress?: number;
  status?: "OnGoing" | "Finished" | "OnWork" | "OnProcess";
}

// fetch client Info
export const getClientProjectInfo = (projId?: string) =>
  useQuery<IClientProjectInfo, Error>({
    queryKey: ["client-Info", projId],
    queryFn: () =>
      api
        .get("api/Project/Get-Client-Info", {
          params: { projId },
        })
        .then((res) => res.data),
  });
// fetch all project client Infos
export const getClientsProjectInfos = () =>
  useQuery<IClientProjectInfo[], Error>({
    queryKey: ["client-Infos"],
    queryFn: () =>
      api.get("api/Project/GetClientsProjectInfos").then((res) => res.data),
  });

//Update client Info
// Add new project with existing client
export const useUpdateClientProjectInfo = () => {
  return useMutation({
    mutationFn: async (formData: IClientProjectInfo) => {
      try {
        const { data } = await api.put(
          "api/Project/Update-Client-Project",
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        return data;
      } catch (error) {
        console.error("Error updating client project info:", error);
        throw error; // Ensure the error is thrown for react-query to handle
      }
    },

    onError: (error: any) => {
      toast.error(error.response.data);
      console.error("Error updating:", error);
    },
  });
};

export interface IProjectSupply {
  description: string;
  lineTotal: string;
}

// fetch all project Supply
export const getProjectSupply = (projId?: string) => {
  return useQuery<IProjectSupply[], Error>({
    queryKey: ["project-supply-quotation", projId],
    queryFn: async () => {
      const response = await api.get("api/Project/ProjectQuotationSupply", {
        params: { projId },
      });
      return response.data;
    },
  });
};

export interface ProjectQuotationTotalExpense {
  quoteId: string;
  subTotal: string;
  discount: string;
  discountRate: string;
  subTotalAfterDiscount: string;
  vat: string;
  vatRate: string;
  total: string;
  estimationDate: number;
  totalMaterialCost: IProjectSupply;
  totalLaborCost: IProjectSupply;
}

// fetch all project Expense
export const getProjectExpense = (projId?: string) => {
  const customerEmail = useClientUserEmail();
  return useQuery<ProjectQuotationTotalExpense, Error>({
    queryKey: ["project-Expense", projId, customerEmail], // Include parameters for better cache control
    queryFn: () =>
      api
        .get("api/Project/ProjectQuotationExpense", {
          params: { projId, customerEmail },
        })
        .then((res) => res.data),
  });
};

export interface IEditProfit {
  projId: string;
  profitRate: number;
}

export const useUpdateProfitRate = () => {
  const user = useUserEmail();
  return useMutation({
    mutationFn: async (formData: IEditProfit) => {
      const { data } = await api.put(
        "api/Project/Update-Profit-Rate",
        { ...formData, userEmail: user },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return data;
    },
    onError: (error: any) => {
      toast.error(error.response.data);
      console.error("Error updating:", error);
    },
  });
};

export const useUpdateProjectToOnProcess = () => {
  const user = useUserEmail();
  return useMutation({
    mutationFn: async (id: { projId: string }) => {
      const { data } = await api.put(
        "api/Project/UpdateProjectToOnProcess",
        { ...id, userEmail: user },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return data;
    },
    onError: (error: any) => {
      toast.error(error.response.data);
      console.error("Error updating:", error);
    },
  });
};

export const useUpdateProjectToOnWork = () => {
  const user = useUserEmail();
  return useMutation({
    mutationFn: async (id: { projId: string }) => {
      const { data } = await api.put(
        "api/Project/UpdateProjectToOnWork",
        { ...id, userEmail: user },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return data;
    },
    onError: (error: any) => {
      toast.error(error.response.data);
      console.error("Error updating:", error);
    },
  });
};
