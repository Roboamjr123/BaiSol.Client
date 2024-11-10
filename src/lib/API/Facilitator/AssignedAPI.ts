import { useQuery } from "@tanstack/react-query";
import { useUserEmail } from "../../../state/Hooks/userHook";
import { api } from "../AuthAPI";

export const getAssignedProject = () => {
  const userEmail = useUserEmail();
  return useQuery<string, Error>({
    queryKey: ["assigned-project", userEmail],
    queryFn: async () => {
      const response = await api.get("api/Facilitator/GetAssignedProject", {
        params: {
          userEmail: userEmail,
        },
      });
      return response.data || "73288400-fc5f-4888-96c0-6733c7c3e024";
    },
  });
};

export interface IClientProjectInfoDTO {
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
  projectProgress: number;
  status: string;
}

export const getProjectHistories = () => {
  const userEmail = useUserEmail();
  return useQuery<IClientProjectInfoDTO[], Error>({
    queryKey: ["GetProjectHistories", userEmail],
    queryFn: async () => {
      const response = await api.get("api/Facilitator/GetProjectHistories", {
        params: {
          userEmail: userEmail,
        },
      });
      return response.data;
    },
  });
};
