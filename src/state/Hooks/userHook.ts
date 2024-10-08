import { useSelector } from "react-redux";
import { selectUser } from "../authSlice";

export const useUserEmail = () => {
  const user = useSelector(selectUser);
  return user?.email || null;
};
export const useClientUserEmail = () => {
  const user = useSelector(selectUser);
  return user?.role === "Client" ? user?.email : null;
};
