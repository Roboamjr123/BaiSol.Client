import { useMemo, useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../../lib/API/AuthAPI";
import { pricingPlans } from "../../../Landing-Page/constants/landing-page";
import { Check } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLoginMutation();
  const [validUser, setValidUser] = useState(false);
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

    try {
      loginMutation.mutate(formData, {
        onSuccess: (data) => {
          if (data.flag) {
            toast.success(data.message);
            setValidUser(true);
          } else {
            toast.error(data.message);
          }
        },
        onError: (error) => {
          toast.error(error.message);
        },
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  if (validUser) {
    navigate("/verify-2FA", {
      state: { email: email },
    });
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
      <div className="flex flex-col items-center justify-center w-full lg:1/2">
        <h4 className="font-semibold text-orange-500 tracking-wider">
          Choose the Right Plan for You
        </h4>
        <h1 className="text-base lg:text-xl text-center font-bold mb-4 tracking-wider">
          Pricing Plans
        </h1>
        <div className="flex flex-wrap">
          {pricingPlans.map((option, index) => (
            <div
              key={index}
              className="w-full sm:w-1/2 lg:w-1/3 m-6 lg:m-0  text-center lg:px-4 hover:scale-105 duration-300"
            >
              <div className="p-5 border rounded-xl">
                <p className="font-bold text-2xl lg:text-base">
                  Package{" "}
                  <span className="text-orange-500">{option.title}</span>
                </p>
                <p className="text-xl lg:text-lg  font-extrabold py-5 tracking-wider">
                  {option.price}
                </p>
                <p className="lg:text-xs font-bold">{option.type}</p>
                <ul>
                  {option.features.map((feature, index) => (
                    <li key={index} className="flex mt-5 items-center">
                      <Check className="text-green-600" />
                      <span className="ml-2 text-left lg:text-xs">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
