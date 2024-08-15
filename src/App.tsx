import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Home from "./main/pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./main/forms/auth/LoginForm";
import Verify2FA from "./main/forms/auth/Verify2FA";
import LandingPage from "./main/pages/LandingPage";
import Body from "./Landing-Page/components/Body";
import RegistrationForm from "./main/forms/auth/RegistrationForm";
import ConfirmEmail from "./main/components/ConfirmEmail";
import ForgotPass from "./main/forms/auth/ForgotPass";
import ChangePass from "./main/forms/auth/ChangePass";
import AdminLayout from "./layouts/AdminLayout";
import Personnel from "./Admin/pages/Personnel";
import SampleTable from "./Admin/pages/Sample";

const queryClient = new QueryClient({});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer />

      {/* <Routes>
        <Route path="/*" element={<LandingPage />}>
          <Route index element={<Body />} />
          <Route path="LogIn" element={<LoginPage />} />
          <Route path="Confirm-Email" element={<ConfirmEmail />} />
          <Route path="forgot-password" element={<ForgotPass />} />
          <Route path="change-password" element={<ChangePass />} />
        </Route>
        <Route path="/verify-2FA" element={<Verify2FA />} />
        <Route path="/home" element={<Home />} />
      </Routes> */}

      {/* <Route path="/" element={<RegistrationForm />} /> */}

      <AdminLayout>
        <Routes>
          <Route path="/" index element={<Home />}></Route>{" "}
          <Route path="Register" element={<SampleTable />} />
          <Route path="Confirm-Email" element={<ConfirmEmail />} />
          <Route path="personnel" element={<Personnel />}></Route>
        </Routes>
      </AdminLayout>

      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  );
}

export default App;
