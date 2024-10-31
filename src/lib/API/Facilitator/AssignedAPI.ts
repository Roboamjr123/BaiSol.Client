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
