import { Button, Input } from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  fetchResetPasswordToken,
  useNewPasswordMutation,
} from "../../../lib/API/AuthAPI";

const ChangePass = () => {
  const [email, setEmail] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [conPassword, setConPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [successChange, setSuccessChange] = useState(false);
  const changePassToken = fetchResetPasswordToken();
  const changePass = useNewPasswordMutation();
  const location = useLocation();
  const navigate = useNavigate();

  const validatePassword = (value: string) =>
    value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/);

  const isInvalidPassword = useMemo(() => {
    if (newPassword === "") return false;

    return validatePassword(newPassword) ? false : true;
  }, [newPassword]);

  // Memoized password confirmation validation result
  const isInvalidConPassword = useMemo(() => {
    if (newPassword === conPassword) return false;
    return true;
  }, [newPassword, conPassword]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const encodedToken = queryParams.get("token")?.toString() ?? "";
    const fetchedToken = decodeURIComponent(encodedToken.replace(/\s/g, "+"));
    const fetchedEmail = queryParams.get("email")?.toString() ?? "";

    setToken(fetchedToken);
    setEmail(fetchedEmail);

    if (token && email) {
      changePassToken.mutate({ token, email });
    }
  }, [location.search, changePassToken.mutate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      email: email,
      password: newPassword.trim(),
      token: token,
    };

    changePass.mutate(formData, {
      onSuccess: (data) => {
        toast.success(data);
        setSuccessChange(true);
      },
      onError: () => {
        toast.error("Invalid token!");
      },
    });
  };

  if (successChange) {
    navigate("/");
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-md relative flex flex-col p-4 m-4 rounded-md text-black bg-gray-200">
        <div className="text-2xl font-bold mb-6 text-[#1e0e4b] text-center">
          Change <span className="text-orange-500">Password</span>
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
              isReadOnly
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
              label="New Password"
              isInvalid={isInvalidPassword}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              errorMessage={
                "Password must be: 8 to 24 characters long, include uppercase and lowercase letters, a number, and a special character (!, @, #, $, %)."
              }
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
              label="Confirm Password"
              isInvalid={isInvalidConPassword}
              value={conPassword}
              onChange={(e) => setConPassword(e.target.value)}
              autoComplete="confirm-password"
              errorMessage={"Passwords don't match!"}
            />
          </div>
          <Button
            isDisabled={
              isInvalidConPassword ||
              isInvalidPassword ||
              email === "" ||
              newPassword === ""
            }
            isLoading={changePass.isPending}
            type="submit"
            className="bg-orange-400 w-max m-auto text-white rounded-lg py-2 px-3 hover:bg-gray-200 hover:text-orange-500 transition-all duration-300 ease-in"
          >
            {changePass.isPending ? "Loading..." : "Change Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChangePass;
