import { useQuery } from "@tanstack/react-query";
import { api } from "../AuthAPI";
import { selectUser } from "../../../state/authSlice";
import { useSelector } from "react-redux";

interface IProjId {
  projId: string;
}

// const user = useSelector(selectUser);
// const userEmail = user.email || "";
const userEmail = "richardddquirante98@gmail.com";

export const getClientProjId = (userEmail: string) => {
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
