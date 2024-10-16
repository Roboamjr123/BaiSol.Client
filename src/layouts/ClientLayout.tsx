import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { validateToken } from "../lib/API/TokenValidation";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { selectUser, setUser } from "../state/authSlice";
import Sidebar from "./shared/Sidebar/Sidebar";
import Header from "./shared/Header/Header";
import { Outlet } from "react-router-dom";
import { getClientSidebarLinks } from "../lib/constants/SidebarLinks";
import { getClientProjId } from "../lib/API/Client/ClientProjectAPI";

const ClientLayout = () => {
  const dispatch = useDispatch();

  // const user = useSelector(selectUser);
  // const customerEmail = user.role === "Client" ? user.email : "";
  // const customerEmail = "richardddquirante98@gmail.com";
  // const customerEmail = "richardddquirante98@gmail.com";
  const { data: clientProjId, isLoading, error } = getClientProjId();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sidebarLinks = getClientSidebarLinks(clientProjId?.projId);

  useEffect(() => {
    const validateAndSetUser = async () => {
      const isValidToken = await validateToken();
      if (isValidToken) {
        const accessToken = Cookies.get("accessToken");

        if (!accessToken) return;

        const decoded: any = jwtDecode(accessToken);
        const user = {
          userId:
            decoded[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
            ],
          email:
            decoded[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
            ],
          userName:
            decoded[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
            ],
          userRole:
            decoded[
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ],
        };
        dispatch(setUser(user));
      }
    };
    validateAndSetUser();
  }, [dispatch]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        links={sidebarLinks}
        isOpen={isSidebarOpen}
        setOpen={setIsSidebarOpen}
      />
      <div className="flex-1 flex overflow-x-hidden scrollbar-hide scrollbar-track-white scrollbar-thumb-orange-100 flex-col mx-auto h-full">
        <Header
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <main className="flex-1 p-5">{<Outlet />}</main>
      </div>
    </div>
  );
};

export default ClientLayout;
