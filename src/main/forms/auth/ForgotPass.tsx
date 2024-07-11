import { useMemo, useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { MdEmail } from "react-icons/md";
import { useForgotPasswordMutation } from "../../../lib/API/AuthAPI";
import { toast } from "react-toastify";

const ForgotPass = () => {
  const [email, setEmail] = useState("");
  const forgotPass = useForgotPasswordMutation();

  const validateEmail = (value: any) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const isInvalid = useMemo(() => {
    if (email === "") return false;

    return validateEmail(email) ? false : true;
  }, [email]);

  const handleSubmit = (event: any) => {
    event.preventDefault();

    forgotPass.mutate(email, {
      onSuccess: (data) => {
        toast.success(data);
      },
      onError: () => {
        toast.error("Couldn't send link to email, please try again.");
      },
    });
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-4 mx-auto min-h-screen lg:py-0">
        <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
          <h1 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Forgot your password?
          </h1>
          <span className="font-light text-gray-500 dark:text-gray-400">
            Don't fret! Just type in your email and we will send you a link to
            reset your password!
          </span>
          <form
            className="flex flex-col items-end mt-4 space-y-4 lg:mt-5 md:space-y-5"
            onSubmit={handleSubmit}
          >
            <div className="w-full">
              <Input
                endContent={
                  <div className="flex items-center h-full">
                    <MdEmail color="#666666" size={20} />
                  </div>
                }
                value={email}
                type="email"
                label="Email"
                variant="flat"
                isInvalid={isInvalid}
                color={isInvalid ? "danger" : "default"}
                errorMessage={
                  isInvalid ? "Please enter a valid email" : "Email"
                }
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button
              isLoading={forgotPass.isPending}
              type="submit"
              className="bg-orange-400 w-max text-white rounded-lg py-2 px-3 hover:bg-gray-200 hover:text-orange-500 transition-all duration-300 ease-in"
            >
              {forgotPass.isPending ? "Loading..." : "Reset password"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ForgotPass;
