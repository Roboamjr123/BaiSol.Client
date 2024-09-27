import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "./AuthAPI";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { selectUser } from "../../state/authSlice";

// const userEmail = useSelector(selectUser);

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

export const getAllRequests = () => {
  return useQuery<IAllRequest[], Error>({
    queryKey: ["all-request"],
    queryFn: async () => {
      const response = await api.get("api/Requisition/AllRequest");
      return response.data;
    },
  });
};

export const getRequestsByProj = (projId: string) => {
  return useQuery<IAllRequest[], Error>({
    queryKey: ["request-by-project", projId],
    queryFn: async () => {
      const response = await api.get("api/Requisition/SentRequestByProj", {
        params: { projId },
      });
      return response.data;
    },
  });
};

interface IRequestSupplies {
  suppId: number;
  supplyName: string;
}

export const getRequestMaterialSupplies = (
  projId: string,
  supplyCtgry?: "Material"
) => {
  return useQuery<IRequestSupplies[], Error>({
    queryKey: ["request-material-supplies"],
    queryFn: async () => {
      const response = await api.get("api/Requisition/RequestSupplies", {
        params: { projId, supplyCtgry },
      });
      return response.data;
    },
  });
};

export const getRequestEquipmentSupplies = (
  projId: string,
  supplyCtgry?: "Equipment"
) => {
  return useQuery<IRequestSupplies[], Error>({
    queryKey: ["request-equipment-supplies"],
    queryFn: async () => {
      const response = await api.get("api/Requisition/RequestSupplies", {
        params: { projId, supplyCtgry },
      });
      return response.data;
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
          submittedBy: "richardquirante98@gmail.com",
          // submittedBy: userEmail,
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

interface IActionRequest {
  reqId: number[];
}

export const useApproveRequest = () => {
  return useMutation({
    mutationFn: async (data: IActionRequest) => {
      const response = await api.put(
        "api/Requisition/ApproveRequest",
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

export const useDeclineRequest = () => {
  return useMutation({
    mutationFn: async (data: IActionRequest) => {
      const response = await api.put(
        "api/Requisition/DeclineRequest",
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
      console.error("Error decline request:", error);
    },
  });
};

interface IUpdateRequestQuantity {
  reqId: number;
  newQuantity: number;
}

export const useUpdateRequestQuantity = () => {
  return useMutation({
    mutationFn: async (data: IUpdateRequestQuantity) => {
      const response = await api.put(
        "api/Requisition/UpdateRequestQuantity",
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
      console.error("Error decline request:", error);
    },
  });
};

interface IDeleteRequest {
  reqId: number;
}

export const useDeleteRequest = () => {
  return useMutation({
    mutationFn: async (data: IDeleteRequest) => {
      const response = await api.delete("api/Requisition/DeleteRequest", {
        data: {
          reqId: data.reqId, // Include the reqId in the body
          userEmail: "richardquirante98@gmail.com", // Include the userEmail in the body
          // userEmail: userEmail,
        },
      });
      return response.data;
    },
    onError: (error: any) => {
      toast.error(error.response?.data || "An error occurred");
      console.error("Error delete request:", error);
    },
  });
};
