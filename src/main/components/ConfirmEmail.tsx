import { useLocation } from "react-router-dom";
import { useConfirmEmail } from "../../lib/API/AuthAPI";
import { useEffect } from "react";
import { toast } from "react-toastify";

const ConfirmEmail = () => {
  const location = useLocation();
  const confirmEmail = useConfirmEmail();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const encodedToken = queryParams.get("token")?.toString() ?? "";
    const token = decodeURIComponent(encodedToken.replace(/\s/g, "+"));
    const email = queryParams.get("email");

    if (token && email) {
      confirmEmail.mutate(
        { token, email },
        {
          onSuccess: (data) => {
            // toast.success("Your email is successfully verified!");
            toast.success(data.message);
          },
        }
      );
    }
  }, [location.search, confirmEmail.mutate]);

  return (
    <div className="py-28 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold mb-4">Email Confirmation</h1>
        <p className="text-lg mb-4">
          Your account has been successfully confirmed! Thank you for verifying
          your email address.
        </p>
        <p className="text-lg mb-4">
          You can now enjoy full access to our services. If you have any
          questions or need further assistance, please don't hesitate to contact
          us.
        </p>
      </div>
    </div>
  );
};

export default ConfirmEmail;
