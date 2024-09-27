// const userEmail = useSelector(selectUser);

import { Mutation, useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../AuthAPI";
import { toast } from "react-toastify";

export interface IAllRequest {
  reqId: number;
  submittedAt: string;
  reviewedAt: string;
  status: string;
  quantityRequested: number;
  qoh: number;
  requestSupply: string;
  supplyCategory: string;
  projectName: string;
  submittedBy: string;
  reviewedBy: string;
}

export const getRequestsByProj = () => {
  return useQuery<IAllRequest[], Error>({
    queryKey: ["request-by-project", "Facilitator"],
    queryFn: async () => {
      const response = await api.get("api/Requisition/SentRequestByProj", {
        params: {
          // userEmail: userEmail
          userEmail: "facilitator@email.com",
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

export const getRequestMaterialSupplies = (supplyCtgry?: "Material") => {
  return useQuery<IRequestSupplies[], Error>({
    queryKey: ["request-material-supplies", "Facilitator"],
    queryFn: async () => {
      const response = await api.get("api/Requisition/RequestSupplies", {
        params: {
          // userEmail: userEmail
          userEmail: "facilitator@email.com",
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
          userEmail: "richardquirante98@gmail.com",
          // userEmail: userEmail,
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
    queryKey: ["assigned-materials", "Facilitator"],
    // queryKey: ["assigned-materials", userEmail],
    queryFn: async () => {
      const response = await api.get(
        "api/Facilitator/AssignedMaterialsSupply",
        {
          params: {
            userEmail: "richardquirante98@gmail.com",
            // userEmail: userEmail,
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
    queryKey: ["assigned-equipment", "Facilitator"],
    // queryKey: ["assigned-equipment", userEmail],
    queryFn: async () => {
      const response = await api.get(
        "api/Facilitator/AssignedEquipmentSupply",
        {
          params: {
            userEmail: "richardquirante98@gmail.com",
            // userEmail: userEmail,
          },
        }
      );
      return response.data;
    },
  });
};
