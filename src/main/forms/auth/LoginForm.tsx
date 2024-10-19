import { useMemo, useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../../lib/API/AuthAPI";
import { pricingPlans } from "../../../Landing-Page/constants/landing-page";
import { Check } from "lucide-react";
import {
  Option,
  ProjectDescriptionSystemType,
} from "../../../lib/constants/ProjectPackage";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLoginMutation();
  const [validUser, setValidUser] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (value: string) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const isInvalid = useMemo(() => {
    if (email === "") return false;

    return validateEmail(email) ? false : true;
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      email: email.slice(),
      password: password,
    };

    loginMutation.mutateAsync(formData, {
      onSuccess: (res) => {
        if (res.flag && res.isDefaultAdmin) {
          setIsAdmin(true);
        } else {
          setValidUser(true);
        }
      },
    });
  };

  if (validUser) {
    navigate("/verify-2FA", {
      state: { email: email },
    });
  }

  if (isAdmin) {
    navigate("/");
  }

  return (
    <div className="flex flex-wrap lg:flex-nowrap">
      <div className="max-w-md relative flex flex-col p-10 m-8 rounded-md text-black bg-gray-200 w-full lg:1/2">
        <div className="text-2xl font-bold mb-2 text-[#1e0e4b] text-center">
          Welcome back to <span className="text-orange-500">BaiSol</span>
        </div>
        <div className="text-sm font-normal mb-4 text-center text-[#1e0e4b]">
          Log in to your account
        </div>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="block relative">
            <Input
              endContent={
                <div className="flex items-center h-full">
                  <MdEmail color="#666666" size={20} />
                </div>
              }
              isRequired
              value={email}
              type="email"
              label="Email"
              variant="flat"
              isInvalid={isInvalid}
              color={isInvalid ? "danger" : "default"}
              errorMessage={isInvalid ? "Please enter a valid email" : "Email"}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="block relative">
            <Input
              type={showPassword ? "text" : "password"}
              variant="flat"
              endContent={
                <div
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:cursor-pointer flex items-center h-full"
                >
                  {showPassword ? (
                    <FaEye color="#666666" size={20} />
                  ) : (
                    <FaEyeSlash color="#666666" size={20} />
                  )}
                </div>
              }
              isRequired
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              errorMessage={"Your password entered is incorrect"}
            />
          </div>
          <div className="flex flex-col gap-2 pb-2">
            <NavLink
              className="text-sm text-orange-300 hover:text-orange-500"
              to="/forgot-password"
            >
              Forgot your password?
            </NavLink>
            <span className="text-sm text-[#1e0e4b]">
              Don't have an account?
              <NavLink
                className="text-sm text-orange-300 hover:text-orange-500"
                to="/register-client"
              >
                {" "}
                Register now
              </NavLink>
            </span>
          </div>
          <Button
            isDisabled={email === "" || password === ""}
            isLoading={loginMutation.isPending}
            type="submit"
            className="bg-orange-400 w-max m-auto text-white rounded-lg py-2 px-3 hover:bg-gray-200 hover:text-orange-500 transition-all duration-300 ease-in"
          >
            {loginMutation.isPending ? "Loading..." : "Sign in"}
          </Button>
        </form>
      </div>

      {/* Project Cost Estimations */}
      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 mx-auto">
        <h4 className="font-semibold text-orange-500 tracking-wide mb-2">
          Choose the Right Plan for You
        </h4>
        <h1 className="text-lg lg:text-2xl text-center font-bold mb-6 tracking-wider">
          Project Cost Estimations
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full px-2 gap-3">
          {ProjectDescriptionSystemType.map((system, index) => (
            <div
              key={index}
              className="bg-white p-6 border rounded-lg shadow-md hover:scale-105 transition-transform duration-300 sm:max-w-sm max-w-lg"
            >
              <p className="text-lg lg:text-base font-bold text-orange-500 mb-2 text-center">
                {system.type}
              </p>
              {system.options.map((option, i) => (
                <div key={i} className="py-2">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center space-x-1">
                      <Check className="text-green-600 text-xs" />
                      <p className="text-xs lg:text-sm font-bold tracking-wider">
                        {option.kWCapacity}
                      </p>
                    </div>
                    <p className="text-xs font-semibold text-gray-500 text-right">
                      ₱{" "}
                      {new Intl.NumberFormat("en-PH", {
                        style: "decimal",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(option.cost)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
