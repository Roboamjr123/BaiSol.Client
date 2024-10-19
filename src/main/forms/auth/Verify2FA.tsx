import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { use2FAMutation, useResend2FA } from "../../../lib/API/AuthAPI";
import { Button } from "@nextui-org/react";

const Verify2FA: React.FC = () => {
  const [countdown, setCountdown] = useState(120);
  const [isDisabled, setIsDisabled] = useState(true);
  const loginLocation = useLocation();
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const email = loginLocation.state?.email;
  const OTPConfirmation = use2FAMutation();
  const resendOTP = useResend2FA();
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsDisabled(false);
    }
  }, [countdown]);

  useEffect(() => {
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, []);

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < otp.length - 1 && inputsRef.current[index + 1]) {
        inputsRef.current[index + 1]?.focus();
      } else {
        inputsRef.current[index]?.blur();
      }
    } else {
      e.target.value = "";
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      if (index > 0 && inputsRef.current[index - 1]) {
        inputsRef.current[index - 1]?.focus();
      }
    } else if (!/^[0-9]$/.test(e.key) && e.key !== "Tab" && !e.metaKey) {
      e.preventDefault();
    }
  };

  const handleFocus = (index: number) => {
    inputsRef.current[index]?.select();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text");
    if (/^[0-9]{6}$/.test(pasteData)) {
      const newOtp = pasteData.split("");
      setOtp(newOtp);
      inputsRef.current[5]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (otp.join("").length !== 6 || otp.includes("")) {
      toast.warning("Please enter a valid 6-digit OTP.");
      return;
    }
    const formData = {
      email: email,
      code: otp.join("").toString(),
    };

    OTPConfirmation.mutateAsync(formData, {
      onSuccess: (data) => {
        toast.success(data);
        navigate("/");
      },
    });
  };

  const handleResendOTP = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    resendOTP.mutate(email, {
      onSuccess: (data) => {
        toast.success(data.message);
      },
    });
  };

  return (
    <div className="flex items-center px-2 justify-center min-h-screen">
      <div className="max-w-md mx-auto text-center bg-white px-4 sm:px-8 py-10 rounded-xl shadow">
        <header className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Email Verification</h1>
          <p className="text-[15px] text-slate-500">
            Enter the 6-digit verification code that was sent to your email
            account.
          </p>
        </header>
        <form id="otp-form" onSubmit={handleSubmit}>
          <div className="flex items-center justify-center gap-3">
            {otp.map((value, index) => (
              <input
                key={index}
                type="text"
                className="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-orange-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                value={value}
                onChange={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onFocus={() => handleFocus(index)}
                onPaste={handlePaste}
                ref={(el) => (inputsRef.current[index] = el)}
                maxLength={1}
              />
            ))}
          </div>
          <div className="max-w-[260px] mx-auto mt-4">
            <Button
              isLoading={OTPConfirmation.isPending}
              type="submit"
              className="w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-orange-400 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-950/10 hover:bg-indigo-200 focus:outline-none focus:ring focus:ring-indigo-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 transition-colors duration-150"
            >
              Verify Account
            </Button>
          </div>
        </form>
        <div className="flex justify-center items-center text-sm text-slate-500 mt-4">
          <span>Didn't receive code?</span>
          <form onSubmit={handleResendOTP} className="flex">
            <Button
              variant="flat"
              type="submit"
              className={`font-medium bg-transparent ${
                isDisabled
                  ? "text-slate-400"
                  : "text-orange-500 hover:text-orange-800"
              }`}
              href="#0"
              onClick={(e) => {
                if (isDisabled) {
                  e.preventDefault();
                } else {
                  // Handle the resend OTP logic here
                  setCountdown(120);
                  setIsDisabled(true);
                }
              }}
            >
              Resend{" "}
              {isDisabled &&
                `in ${Math.floor(countdown / 60)}:${String(
                  countdown % 60
                ).padStart(2, "0")}`}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Verify2FA;
