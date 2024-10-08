import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../AuthAPI";
import { useSelector } from "react-redux";
import { selectUser } from "../../../state/authSlice";
import { toast } from "react-toastify";
import { useClientUserEmail } from "../../../state/Hooks/userHook";

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

// fetch all project Info
export const getProjectInfo = (projId?: string) => {
  const customerEmail = useClientUserEmail();
  useQuery<IProjectInfo, Error>({
    queryKey: ["project-Info", projId, customerEmail],
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
  discountRate: number;
  vatRate: number;
  clientId: string;
  clientFName: string;
  clientLName: string;
  clientContactNum: string;
  clientAddress: string;
  clientMonthlyElectricBill: number;
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

// const user = useSelector(selectUser);
// const customerEmail = user.role === "Client" ? user.email : "";
// const customerEmail = "richardddquirante98@gmail.com";

// fetch all project Supply
export const getProjectSupply = (projId?: string) => {
  const customerEmail = useClientUserEmail();
  useQuery<IProjectSupply[], Error>({
    queryKey: ["project-Supply", projId, customerEmail],
    queryFn: () =>
      api
        .get("api/Project/ProjectQuotationSupply", {
          params: { projId, customerEmail: customerEmail },
        })
        .then((res) => res.data),
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
  totalMaterialCost: IProjectSupply;
  totalLaborCost: IProjectSupply;
}

// fetch all project Expense
export const getProjectExpense = (projId?: string) => {
  const customerEmail = useClientUserEmail();
  useQuery<ProjectQuotationTotalExpense, Error>({
    queryKey: ["project-Expense", projId, customerEmail], // Include parameters for better cache control
    queryFn: () =>
      api
        .get("api/Project/ProjectQuotationExpense", {
          params: { projId, customerEmail },
        })
        .then((res) => res.data),
  });
};
