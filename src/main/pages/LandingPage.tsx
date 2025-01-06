import NavBar from "../../Landing-Page/components/NavBar";
import { Outlet, useNavigate } from "react-router-dom";
import Footer from "../../layouts/shared/Footer";
import { setUser } from "../../state/authSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { validateToken } from "../../lib/API/TokenValidation";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const LandingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
        navigate("/");
      }
    };
    validateAndSetUser();
  }, [dispatch]);

  return (
    <>
      <div className="flex flex-col min-h-screen ">
        <NavBar />
        <Outlet />
        <Footer />
      </div>
    </>
  );
};

export default LandingPage;
