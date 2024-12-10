import { useMutation, useQuery } from "@tanstack/react-query";
import { useUserEmail } from "../../../state/Hooks/userHook";
import { api } from "../AuthAPI";
import { toast } from "react-toastify";

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
      return response.data;
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
  installers?: [{ name: string; position: string }];

  plannedStarted: string;
  plannedEnded: string;
  plannedWorkingDays: string;
  actualStarted: string;
  actualEnded: string;
  actualdWorkingDays: string;
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

export interface IIsAssignedProjectOnDemobilization {
  isDemobilization: boolean;
  projId: string;
}

export const getIsAssignedProjectOnDemobilization = () => {
  const userEmail = useUserEmail();
  return useQuery<IIsAssignedProjectOnDemobilization, Error>({
    queryKey: ["IsAssignedProjectOnDemobilization", userEmail],
    queryFn: async () => {
      const response = await api.get(
        "api/Facilitator/IsAssignedProjectOnDemobilization",
        {
          params: {
            userEmail: userEmail,
          },
        }
      );
      return response.data;
    },
  });
};

export interface IReturnSupplyDTO {
  eqptCode: string; // Represents the equipment code
  returnedQuantity: number; // Represents the returned quantity of the equipment
}

export const useReturnAssignedEquipment = () => {
  const userEmail = useUserEmail();
  return useMutation({
    mutationFn: async (formData: IReturnSupplyDTO[]) => {
      const response = await api.put(
        "api/Facilitator/ReturnAssignedEquipment",
        formData, // Sending the form data directly in the body
        {
          params: {
            userEmail, // Adding the user email as a query parameter
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    onError: (error: any) => {
      toast.error(error.response.data);
      console.error("Error return supply:", error);
    },
  });
};
