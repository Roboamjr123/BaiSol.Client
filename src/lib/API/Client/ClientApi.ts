import { useQuery } from "@tanstack/react-query";
import { api } from "../AuthAPI";

interface ClientUser {
  id: string;
  email: string;
  userName: string;
  adminEmail: string;
  status: string;
  updatedAt: string;
  createdAt: string;
  ClientContactNum: string;
  clientAddress: string;
  clientMonthlyElectricBill: number;
  currentProjId: string;
  clientProjects: [{ projId: string }];
}

//fetch all client users
export const getAllClientUsers = () => {
  return useQuery<ClientUser[], Error>({
    queryKey: [`all-client-user`],
    queryFn: async () => {
      const response = await api.get(`user/User/Users-By-Role?role=Client`);
      // Map the data to exclude unwanted fields
      const filteredData = response.data.map((user: any) => ({
        id: user.id,
        email: user.email,
        userName: user.userName,
        adminEmail: user.adminEmail,
        status: user.status,
        updatedAt: user.updatedAt, // Format updatedAt
        createdAt: user.createdAt, // Format createdAt
        ClientContactNum: user.ClientContactNum, // Fixed field name
        clientAddress: user.clientAddress, // Ensure correct field mapping
        clientMonthlyElectricBill: user.clientMonthlyElectricBill,
        currentProjId: user.currentProjId,
        clientProjects: user.clientProjects,
      }));
      return filteredData;
    },
  });
};
