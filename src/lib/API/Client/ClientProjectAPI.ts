import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../AuthAPI";
import { selectUser } from "../../../state/authSlice";
import { useSelector } from "react-redux";
import { useUserEmail } from "../../../state/Hooks/userHook";
import { IClientProjectInfo } from "../Project/ProjectApi";
import { toast } from "react-toastify";

interface IProjId {
  projId: string;
}

// const userEmail = "richardddquirante98@gmail.com";

// export const getClientProjId = (userEmail: string) => {
export const getClientProjId = () => {
  const userEmail = useUserEmail();
  return useQuery<IProjId, Error>({
    queryKey: ["projId", userEmail],
    queryFn: async () => {
      const response = await api.get(`api/Client/GetClientProjectId`, {
        params: { userEmail },
      });
      return response.data;
    },
  });
};

export const getClientProjectHistory = () => {
  const userEmail = useUserEmail();
  return useQuery<IClientProjectInfo[], Error>({
    queryKey: ["project-history", userEmail],
    queryFn: async () => {
      const response = await api.get(`api/Client/GetClientProjectHistory`, {
        params: { userEmail },
      });
      return response.data;
    },
  });
};

export const useApproveProjectQuotation = () => {
  const user = useUserEmail();
  return useMutation({
    mutationFn: async (id: { projId: string }) => {
      const { data } = await api.put(
        "api/Client/ApproveProjectQuotation",
        { ...id, userEmail: user },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return data;
    },
    onError: (error: any) => {
      toast.error(error.response.data);
    },
  });
};

// Check project status
export const getIsProjectApprovedQuotation = (projId: string) => {
  return useQuery<boolean, Error>({
    queryKey: ["IsProjectApprovedQuotation", projId],
    queryFn: async () => {
      const response = await api.get("api/Client/IsProjectApprovedQuotation", {
        params: {
          projId: projId,
        },
      });
      return response.data;
    },
  });
};
