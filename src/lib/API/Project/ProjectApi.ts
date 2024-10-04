import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../AuthAPI";

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

interface IProjectInfo {
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  projectDescription: string;
  projectDateCreation: string;
  projectDateValidity: string;
}

// fetch all project Info
export const getProjectInfo = (projId?: string, customerEmail?: string) =>
  useQuery<IProjectInfo, Error>({
    queryKey: ["project-Info", projId, customerEmail],
    queryFn: () =>
      api
        .get("api/Project/ProjectQuotationInfo", {
          params: { projId, customerEmail },
        })
        .then((res) => res.data),
  });

interface IProjectSupply {
  description: string;
  lineTotal: string;
}

// fetch all project Supply
export const getProjectSupply = (projId?: string, customerEmail?: string) =>
  useQuery<IProjectSupply[], Error>({
    queryKey: ["project-Supply", projId, customerEmail],
    queryFn: () =>
      api
        .get("api/Project/ProjectQuotationSupply", {
          params: { projId, customerEmail },
        })
        .then((res) => res.data),
  });

interface ProjectQuotationTotalExpense {
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
export const getProjectExpense = (projId?: string, customerEmail?: string) =>
  useQuery<ProjectQuotationTotalExpense, Error>({
    queryKey: ["project-Expense", projId, customerEmail], // Include parameters for better cache control
    queryFn: () =>
      api
        .get("api/Project/ProjectQuotationSupply", {
          params: { projId, customerEmail },
        })
        .then((res) => res.data),
  });
