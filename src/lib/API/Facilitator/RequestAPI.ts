import { Mutation, useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../AuthAPI";
import { toast } from "react-toastify";

// const userEmail = useSelector(selectUser);
const userEmail = "richardqweweuirante98@gmail.com";

export interface IAllRequest {
  reqId: number;
  submittedAt: string;
  reviewedAt: string;
  status: string;
  quantityRequested: number;
  requestSupply: string;
  projectName: string;
  supplyCategory: string;
  submittedBy: string;
  reviewedBy: string;
}

export const getRequestsByProj = () => {
  return useQuery<IAllRequest[], Error>({
    queryKey: ["request-by-project", userEmail],
    queryFn: async () => {
      const response = await api.get("api/Facilitator/SentRequestByProj", {
        params: {
          userEmail: userEmail,
        },
      });
      return response.data;
    },
  });
};

interface IRequestSupplies {
  suppId: number;
  supplyName: string;
}

export const getRequestMaterialSupplies = (supplyCtgry: string) => {
  return useQuery<IRequestSupplies[], Error>({
    queryKey: ["request-material-supplies", supplyCtgry],
    queryFn: async () => {
      const response = await api.get("api/Facilitator/RequestSupplies", {
        params: {
          userEmail: userEmail,
          supplyCtgry,
        },
      });
      return response.data;
    },
  });
};

interface IActionAcknowledge {
  reqId: number[];
}

export const useAcknowledgeRequest = () => {
  return useMutation({
    mutationFn: async (data: IActionAcknowledge) => {
      const response = await api.put(
        "api/Facilitator/AcknowledgeRequest",
        {
          ...data,
          userEmail: userEmail,
        },
        {
          headers: {
            "Content-Type": "application/json", // Ensure it matches the server requirements
          },
        }
      );
      return response.data;
    },
    onError: (error: any) => {
      toast.error(error.response.data);
      console.error("Error approve request:", error);
    },
  });
};

interface IRequestSupply {
  requestDetails: IRequestDetail[];
}
interface IRequestDetail {
  quantityRequested: number;
  suppId: number;
}

export const useRequestSupply = () => {
  return useMutation({
    mutationFn: async (formData: IRequestSupply) => {
      const response = await api.post(
        "api/Requisition/RequestSupply",
        {
          ...formData,
          submittedBy: userEmail,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    onError: (error: any) => {
      toast.error(error.response.data);
      console.error("Error request supply:", error);
    },
  });
};

// Define the MaterialsDetails interface
interface IMaterialsDetails {
  suppId: number; // Required integer field
  mtlId: number; // Required integer field
  mtlDescription: string; // Required string field
  mtlQuantity?: number | null; // Optional integer field (can be null)
  mtlUnit: string; // Required string field
}

// Define the AssignedMaterialsDTO interface
interface IAssignedMaterials {
  mtlCategory: string; // Required string field
  details?: IMaterialsDetails[]; // Optional list of IMaterialsDetails
}

export const getAssignedMaterialsByFacilitator = () => {
  return useQuery<IAssignedMaterials[], Error>({
    queryKey: ["assigned-materials", userEmail],
    queryFn: async () => {
      const response = await api.get(
        "api/Facilitator/AssignedMaterialsSupply",
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

// Define the EquipmentDetails interface
interface IEquipmentDetails {
  suppId: number; // Required integer field
  eqptCode: string; // Required string field
  eqptDescript: string; // Required string field
  quantity: number; // Required integer field
  eqptUnit: string; // Required string field
}

// Define the AssignedEquipmentDTO interface
interface IAssignedEquipment {
  eqptCategory: string; // Required string field
  details?: IEquipmentDetails[]; // Optional list of IEquipmentDetails
}

export const getAssignedEquipmentByFacilitator = () => {
  return useQuery<IAssignedEquipment[], Error>({
    queryKey: ["assigned-equipment", userEmail],
    queryFn: async () => {
      const response = await api.get(
        "api/Facilitator/AssignedEquipmentSupply",
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
