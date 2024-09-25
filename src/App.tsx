import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Home from "./main/pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./main/forms/auth/LoginForm";
import Verify2FA from "./main/forms/auth/Verify2FA";
import LandingPage from "./main/pages/LandingPage";
import Body from "./Landing-Page/components/Body";
import ConfirmEmail from "./main/components/ConfirmEmail";
import ForgotPass from "./main/forms/auth/ForgotPass";
import ChangePass from "./main/forms/auth/ChangePass";
import AdminLayout from "./layouts/AdminLayout";
import Personnel from "./Admin/pages/Personnel";
import ClientPage from "./Client/ClientPage";
import ProjectPage from "./Admin/pages/ProjectPage";
import ProjectCostQuotation from "./Admin/components/quotation/ProjectCostQuotation";
import ProjectAndMaterialsCostQuotation from "./Admin/components/quotation/ProjectAndMaterialsCostQuotation";
import QuotationPage from "./Admin/pages/QuotationPage";
import { useSelector } from "react-redux";
import { selectUser } from "./state/authSlice";
import ClientRegistrationForm from "./main/forms/auth/ClientRegistrationForm";
import PageNotFound from "./main/pages/PageNotFound";
import Supply from "./Admin/pages/Supply";
import ClientQuotePage from "./Admin/pages/ClientQuotePage";

const queryClient = new QueryClient({});

function App() {
  // const user = useSelector(selectUser) || {}; // Ensure user is not null

  // // Default to empty object if user is null to avoid errors
  // const userRole = user?.userRole || null; // Ensure user is not null

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer />

      <Routes>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="Confirm-Email" element={<ConfirmEmail />} />
          <Route path="project" element={<ProjectPage />} />
          <Route path="project/:projId" element={<ClientQuotePage />} />
          <Route path="personnel" element={<Personnel />} />
          <Route path="clients" element={<ClientPage />} />
          <Route path="supply" element={<Supply />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>

        {/* {userRole === "Admin" ? (
          <Route element={<AdminLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="Confirm-Email" element={<ConfirmEmail />} />
            <Route path="project" element={<ProjectPage />} />
            <Route path="project/:projId" element={<QuotationPage />} />
            <Route path="personnel" element={<Personnel />} />
            <Route path="clients" element={<ClientPage />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        ) : ( */}
        {/* <Route path="/*" element={<LandingPage />}>
          <Route index element={<LoginPage />} />
          <Route path="BaiSol" element={<Body />} />
          <Route path="confirm-email" element={<ConfirmEmail />} />
          <Route path="forgot-password" element={<ForgotPass />} />
          <Route path="change-password" element={<ChangePass />} />
          <Route path="*" element={<PageNotFound />} />
          </Route> */}
        {/* )} */}

        <Route path="/verify-2FA" element={<Verify2FA />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register-client" element={<ClientRegistrationForm />} />
      </Routes>

      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  );
}

export default App;
