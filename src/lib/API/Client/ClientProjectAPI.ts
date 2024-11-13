import { useQuery } from "@tanstack/react-query";
import { api } from "../AuthAPI";
import { selectUser } from "../../../state/authSlice";
import { useSelector } from "react-redux";
import { useUserEmail } from "../../../state/Hooks/userHook";
import { IClientProjectInfo } from "../Project/ProjectApi";

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
