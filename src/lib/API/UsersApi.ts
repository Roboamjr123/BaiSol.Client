import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "./AuthAPI";
import { useSelector } from "react-redux";
import { selectUser } from "../../state/authSlice";
import { useUserEmail } from "../../state/Hooks/userHook";

// Define the type of data returned by the API without unwanted fields
interface PersonnelUser {
  id: string;
  email: string;
  userName: string;
  role: string;
  adminEmail: string;
  status: string;
  updatedAt: string;
  createdAt: string;
  currentProjId: string;
  clientProjects: [{ projId: string }];
}

// Create New Admin
export const useRegisterAdminMutation = () => {
  const user = useSelector(selectUser);
  const adminEmail = useUserEmail();
  // const adminEmail = "richardquirante98@gmail.com";
  return useMutation({
    mutationFn: async (formData: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    }) => {
      const data = {
        ...formData,
        adminEmail: adminEmail,
      };
      try {
        const response = await api.post("user/User/Register-Admin", data, {
          headers: {
            "Content-Type": "application/json", // Ensure it matches the server requirements
          },
        });
        return response.data;
      } catch (error) {
        console.error("Error registering admin:", error);
        throw error; // Ensure the error is thrown so it can be handled by react-query
      }
    },
  });
};

// UnComment the admin email for user creator
// Create New Facilitator
export const useRegisterPersonnelUserMutation = (role: string) => {
  const adminEmail = useUserEmail();
  // const adminEmail = "richardquirante98@gmail.com";
  return useMutation({
    mutationFn: async (formData: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      clientAddress?: string;
      clientContactNum?: string;
      isMale?: boolean;
      kWCapacity: number;
      systemType: string;
    }) => {
      const data = {
        ...formData,
        adminEmail: adminEmail,
        // adminEmail: admin.email, // Add adminEmail dynamically
      };

      try {
        const response = await api.post(`user/User/Register-${role}`, data, {
          headers: {
            "Content-Type": "application/json", // Ensure it matches the server requirements
          },
        });
        return response.data;
      } catch (error) {
        console.error("Error registering user:", error);
        throw error; // Ensure the error is thrown so it can be handled by react-query
      }
    },
  });
};

//fetch all admin users
export const getAllAdminUsers = () => {
  return useQuery<PersonnelUser[], Error>({
    queryKey: ["all-admins"],
    queryFn: async () => {
      const response = await api.get("user/User/Users-By-Role?role=Admin");
      // Map the data to exclude unwanted fields
      const filteredData = response.data.map((user: any) => ({
        id: user.id,
        email: user.email,
        userName: user.userName,
        role: user.role,
        adminEmail: user.adminEmail,
        status: user.status,
        updatedAt: new Date(user.updatedAt).toLocaleString(), // Format updatedAt
        createdAt: new Date(user.createdAt).toLocaleString(), // Format createdAt
      }));
      return filteredData;
    },
  });
};

//fetch all facilitator users
export const getAllFacilitatorUsers = () => {
  return useQuery<PersonnelUser[], Error>({
    queryKey: ["all-facilitators"],
    queryFn: async () => {
      const response = await api.get(
        "user/User/Users-By-Role?role=Facilitator"
      );
      // Map the data to exclude unwanted fields
      const filteredData = response.data.map((user: any) => ({
        id: user.id,
        email: user.email,
        userName: user.userName,
        role: user.role,
        adminEmail: user.adminEmail,
        status: user.status,
        updatedAt: user.updatedAt, // Format updatedAt
        createdAt: user.createdAt, // Format createdAt
      }));
      return filteredData;
    },
  });
};

//fetch all admin/facilitator users
export const getAllPersonnelUsers = (role: string) => {
  return useQuery<PersonnelUser[], Error>({
    queryKey: [`all-${role}-user`],
    queryFn: async () => {
      const response = await api.get(`user/User/Users-By-Role?role=${role}`);
      // Map the data to exclude unwanted fields
      const filteredData = response.data.map((user: any) => ({
        id: user.id,
        email: user.email,
        userName: user.userName,
        role: user.role,
        adminEmail: user.adminEmail,
        status: user.status,
        updatedAt: user.updatedAt, // Format updatedAt
        createdAt: user.createdAt, // Format createdAt
        currentProjId: user.currentProjId,
        clientProjects: user.clientProjects,
      }));
      return filteredData;
    },
  });
};

// Define the type for the installer data
interface Installer {
  installerId: number;
  name: string;
  position: string;
  status: string;
  assignedProj: string;
  adminEmail: string;
  updatedAt: string;
  createdAt: string;

  assignedProjects: [{ projId: string; projName: string }];
}

// Get all installers
export const getAllInstaller = () => {
  return useQuery<Installer[], Error>({
    queryKey: ["all-installers"],
    queryFn: async () => {
      const response = await api.get("api/Personnel/Get-Installers");
      return response.data;
    },
  });
};

// Suspend User
export const useSuspendUser = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      return await api.put(`user/User/Suspend-User?id=${id}`, null, {
        headers: {
          "Content-Type": "application/json", // Ensure it matches the server requirements
        },
      });
    },
  });
};

// Activate User
export const useActivateUser = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      return await api.put(`user/User/Activate-User?id=${id}`, null, {
        headers: {
          "Content-Type": "application/json", // Ensure it matches the server requirements
        },
      });
    },
  });
};

// Delete User
export const useDeleteUser = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      return await api.put(`user/User/Deactivate-User?id=${id}`, null, {
        headers: {
          "Content-Type": "application/json", // Ensure it matches the server requirements
        },
      });
    },
  });
};

// Update Installer Status
export const useStatusMutateInstaller = () => {
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return await api.put(
        `api/Personnel/Update-Installer-Status?id=${id}&status=${status}`,
        null,
        {
          headers: {
            "Content-Type": "application/json", // Ensure it matches the server requirements
          },
        }
      );
    },
  });
};

// Add New Installer
export const useAddNewInstaller = () => {
  const adminEmail = useUserEmail();

  // const adminEmail = "richardquirante98@gmail.com";
  return useMutation({
    mutationFn: async (formData: { name: string; position: string }) => {
      const data = {
        ...formData,
        adminEmail: adminEmail,
        // adminEmail: admin.email, // Add adminEmail dynamically
      };

      try {
        const response = await api.post(`api/Personnel/Add-Installer`, data, {
          headers: {
            "Content-Type": "application/json", // Ensure it matches the server requirements
          },
        });
        return response.data;
      } catch (error) {
        console.error("Error adding installer:", error);
        throw error; // Ensure the error is thrown so it can be handled by react-query
      }
    },
  });
};

// Approve Email
export const useApproveClientAccount = () => {
  const adminEmail = useUserEmail();
  return useMutation({
    mutationFn: async (clientId: string) => {
      const response = await api.put("user/User/Approve-Client-Account", null, {
        headers: {
          "Content-Type": "application/json", // Ensure it matches the server requirements
        },
        params: { clientId, adminEmail },
      });
      return response.data;
    },
  });
};
