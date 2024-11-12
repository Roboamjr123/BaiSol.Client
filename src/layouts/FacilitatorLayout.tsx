import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { validateToken } from "../lib/API/TokenValidation";
import { setUser } from "../state/authSlice";
import Sidebar from "./shared/Sidebar/Sidebar";
import Header from "./shared/Header/Header";
import { FacilitatorSidebarLinks } from "../lib/constants/SidebarLinks";
import { Outlet } from "react-router-dom";
import { getIsAssignedProjectOnDemobilization } from "../lib/API/Facilitator/AssignedAPI";
import Loader from "../main/components/Loader";
import AssignedSupplyTable from "../Facilitator/components/tables/AssignedSupplyTable";

const FacilitatorLayout = () => {
  const dispatch = useDispatch();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const { data: dataMobilize, isLoading: isLoadingMobilize } =
    getIsAssignedProjectOnDemobilization();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        links={FacilitatorSidebarLinks}
        isOpen={isSidebarOpen}
        setOpen={setIsSidebarOpen}
      />
      <div className="flex-1 flex overflow-x-hidden scrollbar-hide scrollbar-track-white scrollbar-thumb-orange-100 flex-col mx-auto h-full">
        <Header
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        {isLoadingMobilize ? (
          <Loader /> // Show Loader while loading
        ) : (
          <>
            {/* Accessing isDemobilization directly here */}
            {!dataMobilize?.isDemobilization ? ( // Check if isDemobilization is true
              <main className="flex-1 p-5">
                <Outlet /> // Render Outlet if project is on demobilization
              </main>
            ) : (
              <AssignedSupplyTable
                isDemobilization={dataMobilize.isDemobilization}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FacilitatorLayout;
