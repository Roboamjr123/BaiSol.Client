import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../AuthAPI";
import { useUserEmail } from "../../../state/Hooks/userHook";

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

export interface INotificationMessage {
  notifId: number;
  title: string;
  message: string;
  type: string;
  createdAt: string;
  isRead: boolean;
  facilitatorName: string;
  facilitatorEmail: string;
}

export interface INotificationMessageAndCount {
  notifs: INotificationMessage[];
  notifCount: number;
}

export const getNotificationMessages = () => {
  const userEmail = useUserEmail();
  return useQuery<INotificationMessageAndCount, Error>({
    queryKey: ["Notification-Messages", userEmail],
    queryFn: async () => {
      const response = await api.get(`api/Client/NotificationMessages`, {
        params: { userEmail },
      });
      return response.data;
    },
  });
};

export const getNotificationMessage = () => {
  const userEmail = useUserEmail();
  return useQuery<INotificationMessage, Error>({
    queryKey: ["Notification-Messages", userEmail],
    queryFn: async () => {
      const response = await api.get(`api/Client/NotificationMessage`, {
        params: { userEmail },
      });
      return response.data;
    },
  });
};

export const useReadNotif = () => {
  const clientEmail = useUserEmail();

  return useMutation({
    mutationFn: async ({ notifId }: { notifId: number }) => {
      const response = await api.delete("api/Client/ReadNotif", {
        params: { notifId, clientEmail },
      });
      return response.data;
    },
  });
};
