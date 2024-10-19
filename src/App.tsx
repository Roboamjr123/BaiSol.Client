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
import ClientPage from "./Client/pages/ClientPage";
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
import FacilitatorLayout from "./layouts/FacilitatorLayout";
import ClientLayout from "./layouts/ClientLayout";
import FacilitatorDashboard from "./Facilitator/pages/FacilitatorDashboard";
import AssignedSupplyTable from "./Facilitator/components/tables/AssignedSupplyTable";
import AssignedSupplyPage from "./Facilitator/pages/AssignedSupplyPage";
import Form from "./main/components/Quotation/Form";
import ClientProjectQuotationPage from "./Client/pages/ClientProjectQuotationPage";
import { registerLicense } from "@syncfusion/ej2/base";
import ActivityLogPage from "./Admin/pages/ActivityLogPage";
import ProjectPayment from "./main/components/Payment/ProjectPayment";
import PaymentPage from "./Admin/pages/PaymentPage";
import AllClientPage from "./Admin/pages/AllClientPage";

const queryClient = new QueryClient({});

function App() {
  const user = useSelector(selectUser) || {}; // Ensure user is not null

  // Default to empty object if user is null to avoid errors
  const userRole = user?.userRole || null; // Ensure user is not null

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer />

      <Routes>
        {/* <Route path="/*" element={<LandingPage />}>
          <Route index element={<LoginPage />} />
          <Route path="BaiSol" element={<Body />} />
          <Route path="confirm-email" element={<ConfirmEmail />} />
          <Route path="forgot-password" element={<ForgotPass />} />
          <Route path="change-password" element={<ChangePass />} />
          <Route path="*" element={<PageNotFound />} />
        </Route> */}

        <Route element={<AdminLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="Confirm-Email" element={<ConfirmEmail />} />
          <Route path="project" element={<ProjectPage />} />
          <Route path="project/:projId" element={<ClientQuotePage />} />
          <Route path="personnel" element={<Personnel />} />
          <Route path="clients" element={<ClientPage />} />
          <Route path="activity" element={<ActivityLogPage />} />
          <Route path="supply" element={<Supply />} />
          <Route path="billing" element={<PaymentPage />} />
          <Route path="form" element={<Form />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
        
        {/* 
        <Route element={<ClientLayout />}>
          <Route path="/" element={<ClientPage />} />
          <Route
            path="quotation/:projId"
            element={<ClientProjectQuotationPage />}
          />
          <Route path="payment/:projId" element={<ProjectPayment />} />
          <Route path="*" element={<PageNotFound />} />
        </Route> */}

        {/* <Route element={<FacilitatorLayout />}>
          <Route path="/" element={<FacilitatorDashboard />} />
          <Route path="supply" element={<AssignedSupplyPage />} />


          
          <Route path="*" element={<PageNotFound />} />
        </Route> */}

        {/* {userRole === "Admin" ? (
          <Route element={<AdminLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="project" element={<ProjectPage />} />
            <Route path="project/:projId" element={<ClientQuotePage />} />
            <Route path="personnel" element={<Personnel />} />
            <Route path="clients" element={<AllClientPage />} />
            <Route path="activity" element={<ActivityLogPage />} />
            <Route path="supply" element={<Supply />} />
            <Route path="billing" element={<PaymentPage />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        ) : userRole === "Facilitator" ? (
          <Route element={<FacilitatorLayout />}>
            <Route path="/" element={<FacilitatorDashboard />} />
            <Route path="project" element={<AssignedSupplyPage />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        ) : userRole === "Client" ? (
          <Route element={<ClientLayout />}>
            <Route path="/" element={<ClientPage />} />
            <Route
              path="quotation/:projId"
              element={<ClientProjectQuotationPage />}
            />
            <Route path="payment/:projId" element={<ProjectPayment />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        ) : (
          <Route path="/*" element={<LandingPage />}>
            <Route index element={<LoginPage />} />
            <Route path="BaiSol" element={<Body />} />
            <Route path="confirm-email" element={<ConfirmEmail />} />
            <Route path="forgot-password" element={<ForgotPass />} />
            <Route path="change-password" element={<ChangePass />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        )} */}

        <Route path="/verify-2FA" element={<Verify2FA />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register-client" element={<ClientRegistrationForm />} />
      </Routes>

      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  );
}

export default App;
