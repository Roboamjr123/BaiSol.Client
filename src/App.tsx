import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Home from "./main/pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import LoginPage from "./main/forms/auth/LoginForm";
import Verify2FA from "./main/forms/auth/Verify2FA";
import LandingPage from "./main/pages/LandingPage";
import Body from "./Landing-Page/components/Body";
import RegistrationForm from "./main/forms/auth/RegistrationForm";
import ConfirmEmail from "./main/components/ConfirmEmail";
import ForgotPass from "./main/forms/auth/ForgotPass";
import ChangePass from "./main/forms/auth/ChangePass";

const queryClient = new QueryClient({});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<LandingPage />}>
            <Route index element={<Body />} />
            <Route path="LogIn" element={<LoginPage />} />
            <Route path="Confirm-Email" element={<ConfirmEmail />} />
            <Route path="forgot-password" element={<ForgotPass />} />
            <Route path="change-password" element={<ChangePass />} />
          </Route>
          <Route path="/verify-2FA" element={<Verify2FA />} />
          <Route path="/home" element={<Home />} />
          {/* <Route path="/" element={<RegistrationForm />} /> */}
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  );
}

export default App;
