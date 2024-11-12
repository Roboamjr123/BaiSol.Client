import { useSelector } from "react-redux";
import { selectUser } from "../authSlice";

export const useUserEmail = () => {
  const user = useSelector(selectUser);
  return user?.email || "dosdos.maker@gmail.com";
  // return user?.email || "richardquirante98@gmail.com";
  // return "richardquirante98@gmail.com";
};
export const useClientUserEmail = () => {
  const user = useSelector(selectUser);
  return user?.userRole === "Client" ? user?.email : null;
};

export const useUserRole = () => {
  const user = useSelector(selectUser);
  return user?.userRole || "Developer";
};
