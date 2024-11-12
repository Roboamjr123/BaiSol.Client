import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Home from "./main/pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
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
import { useEffect, useState } from "react";
import { Spinner, spinner } from "@nextui-org/react";
import TestImage from "./TestImage";
import { ToDos } from "./Facilitator/components/task/ToDOs";
import ClientProjectReport from "./Client/pages/ClientProjectReport";
import ClientInfoDisplay from "./main/components/ClientInfo/ClientInfoDisplay";
import ProjectCards2 from "./Admin/components/project/ProjectCards2";
import ReportPage from "./Facilitator/pages/ReportPage";
import SalesReportPage from "./Admin/pages/SalesReportPage";
import ProjectProgress from "./Admin/components/report/ProjectProgress";
import Loader from "./main/components/Loader";
import ProjectReportPage from "./Admin/pages/ProjectReportPage";
import InventoryReportPage from "./Admin/pages/InventoryReportPage";
import Dashboard from "./Admin/components/dashboard/Dashboard";
import ProjectHistoriesPage from "./Facilitator/pages/ProjectHistoriesPage";

const queryClient = new QueryClient({});

function App() {
  const user = useSelector(selectUser) || {}; // Ensure user is not null

  // Default to empty object if user is null to avoid errors
  const userRole = user?.userRole || null; // Ensure user is not null

  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-warning border-t-transparent"></div>
      </div>
    );

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

        {/* <Route element={<AdminLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="Confirm-Email" element={<ConfirmEmail />} />
          <Route path="project" element={<ProjectPage />} />
          <Route path="project/:projId" element={<ClientQuotePage />} />
          <Route path="personnel" element={<Personnel />} />
          <Route path="clients" element={<AllClientPage />} />
          <Route path="activity" element={<ActivityLogPage />} />
          <Route path="activity/:userEmail" element={<ActivityLogPage />} />
          <Route path="supply" element={<Supply />} />
          <Route path="billing" element={<PaymentPage />} />
          <Route path="form" element={<Form />} />
          <Route path="reports/sales" element={<SalesReportPage />} />
          <Route path="reports/project" element={<ProjectReportPage />} />
          <Route
            path="reports/materials"
            element={<InventoryReportPage isMaterial={true} />}
          />
          <Route path="reports/equipment" element={<InventoryReportPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Route> */}

        {/* <Route element={<ClientLayout />}>
          <Route path="/" element={<ClientPage />} />
          <Route
            path="project/:projId"
            element={<ClientProjectReport />}
          />
          <Route
            path="quotation/:projId"
            element={<ClientProjectQuotationPage />}
          />
          <Route path="payment/:projId" element={<ProjectPayment />} />
          <Route path="*" element={<PageNotFound />} />
        </Route> */}

        {/* <Route element={<FacilitatorLayout />}>
          <Route path="/" element={<FacilitatorDashboard />} />
          <Route path="project" element={<ProjectHistoriesPage />} />
          <Route path="supply" element={<AssignedSupplyPage />} />
          <Route path="report" element={<ReportPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Route> */}

        {userRole === "Admin" ? (
          <Route element={<AdminLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="project" element={<ProjectPage />} />
            <Route path="project/:projId" element={<ClientQuotePage />} />
            <Route path="personnel" element={<Personnel />} />
            <Route path="clients" element={<AllClientPage />} />
            <Route path="activity" element={<ActivityLogPage />} />
            <Route path="activity/:userEmail" element={<ActivityLogPage />} />
            <Route path="supply" element={<Supply />} />
            <Route path="billing" element={<PaymentPage />} />
            <Route path="reports/sales" element={<SalesReportPage />} />
            <Route path="reports/project" element={<ProjectReportPage />} />
            <Route
              path="reports/materials"
              element={<InventoryReportPage isMaterial={true} />}
            />
            <Route path="reports/equipment" element={<InventoryReportPage />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        ) : userRole === "Facilitator" ? (
          <Route element={<FacilitatorLayout />}>
            <Route path="/" element={<FacilitatorDashboard />} />
            <Route path="project" element={<ProjectHistoriesPage />} />
            <Route path="supply" element={<AssignedSupplyPage />} />
            <Route path="report" element={<ReportPage />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        ) : userRole === "Client" ? (
          <Route element={<ClientLayout />}>
            <Route path="/" element={<ClientPage />} />
            <Route
              path="quotation/:projId"
              element={<ClientProjectQuotationPage />}
            />{" "}
            <Route path="project/:projId" element={<ClientProjectReport />} />
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
        )}

        {/* <Route path="/" element={<SalesReportPage />} /> */}

        {/* <Route path="/" element={<TestImage />} /> */}
        {/* <Route
          path="/"
          element={<ToDos projId="73288400-fc5f-4888-96c0-6733c7c3e024" />}
        /> */}

        <Route path="/verify-2FA" element={<Verify2FA />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register-client" element={<ClientRegistrationForm />} />
      </Routes>

      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  );
}

export default App;
