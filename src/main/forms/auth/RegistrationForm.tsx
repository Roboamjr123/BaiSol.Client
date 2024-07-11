import React, { useMemo, useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useRegisterAdminMutation } from "../../../lib/API/AuthAPI";
import { toast } from "react-toastify";

const RegistrationForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [conPassword, setConPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const registerAdmin = useRegisterAdminMutation();// State to store the response

  const validateEmail = (value: string) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const isInvalidEmail = useMemo(() => {
    if (email === "") return false;

    return validateEmail(email) ? false : true;
  }, [email]);

  const validatePassword = (value: string) =>
    value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/);

  const isInvalidPassword = useMemo(() => {
    if (password === "") return false;

    return validatePassword(password) ? false : true;
  }, [password]);

  // Memoized password confirmation validation result
  const isInvalidConPassword = useMemo(() => {
    if (password === conPassword) return false;
    return true;
  }, [password, conPassword]);

  // Utility function to capitalize first letter and convert rest to lowercase
  const capitalizeFirstLetter = (str: string) => {
    return (
      str.trim().charAt(0).toUpperCase() + str.trim().slice(1).toLowerCase()
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      firstName: capitalizeFirstLetter(firstName),
      lastName: capitalizeFirstLetter(lastName),
      email: email.toLowerCase().trim(),
      password: password.trim(),
    };

    try {
      registerAdmin.mutate(formData, {
        onSuccess: (data) => {
          toast.success(data);
        },
        onError: (error: any) => {
          if (error.response) {
            toast.error(error.response.data.message);
          } else {
            toast.error(error.response.data.message);
          }
        },
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md relative flex flex-col p-4 m-4 rounded-md text-black bg-gray-200">
          <div className="text-2xl font-bold mb-2 text-[#1e0e4b] text-center">
            Welcome back to <span className="text-orange-500">BaiSol</span>
          </div>
          <div className="text-sm font-normal mb-4 text-center text-[#1e0e4b]">
            Log in to your account
          </div>
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <div className="flex flex-row gap-2">
              <Input
                isRequired
                value={firstName}
                type="text"
                label="Firstname"
                variant="flat"
                errorMessage={"Please fill the blank!"}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <Input
                isRequired
                value={lastName}
                type="text"
                label="Lastname"
                variant="flat"
                errorMessage={"Please fill the blank!"}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
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
                isInvalid={isInvalidEmail}
                color={isInvalidEmail ? "danger" : "default"}
                errorMessage={
                  isInvalidEmail ? "Please enter a valid email." : "Email"
                }
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
                isInvalid={isInvalidPassword}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                isInvalidEmail ||
                firstName === "" ||
                lastName === "" ||
                email === "" ||
                password === ""
              }
              isLoading={registerAdmin.isPending}
              type="submit"
              className="bg-orange-400 w-max m-auto text-white rounded-lg py-2 px-3 hover:bg-gray-200 hover:text-orange-500 transition-all duration-300 ease-in"
            >
              {registerAdmin.isPending ? "Loading..." : "Register"}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegistrationForm;
