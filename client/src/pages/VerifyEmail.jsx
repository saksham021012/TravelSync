import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import OtpInput from "react-otp-input";
import toast from "react-hot-toast";
import { BiArrowBack } from "react-icons/bi";
import { RxCountdownTimer } from "react-icons/rx";
import { sendOtp, signUp } from "../services/Operations/authApi";

const svgBackground = `url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%201000%201000%22%3E%3Cdefs%3E%3Cpattern%20id%3D%22grid%22%20width%3D%2250%22%20height%3D%2250%22%20patternUnits%3D%22userSpaceOnUse%22%3E%3Cpath%20d%3D%22M%2050%200%20L%200%200%200%2050%22%20fill%3D%22none%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.1)%22%20strokeWidth%3D%221%22/%3E%3C/pattern%3E%3C/defs%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22url(%23grid)%22/%3E%3C/svg%3E")`;

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const { signupData, loading } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!signupData) {
      navigate("/signup");
    }
  }, [signupData, navigate]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleVerifyAndSignup = (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    const { firstName, lastName, email, password } = signupData;

    dispatch(signUp(firstName, lastName, email, password, otp, navigate));
  };

  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    dispatch(sendOtp(signupData.email, navigate));
    setResendTimer(30);
  };

 return (
  <div
    style={{
      backgroundImage: `${svgBackground}, linear-gradient(to bottom right, #667eea, #764ba2)`,
      backgroundRepeat: 'repeat',
      backgroundSize: 'auto',
    }}
    className="min-h-[calc(100vh-3.5rem)] grid place-items-center px-4 sm:px-6 lg:px-8"
  >
    {loading ? (
      <div className="spinner"></div>
    ) : (
      <div className="w-full max-w-[500px] p-4 sm:p-6 lg:p-8 bg-white rounded-lg shadow-xl text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-indigo-600">Verify Email</h1>
        <p className="mb-4 text-sm sm:text-base text-gray-600">
          A verification code has been sent to <br />
          <span className="font-medium text-indigo-500">{signupData?.email}</span>
        </p>

        <form onSubmit={handleVerifyAndSignup} className="space-y-6">
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderInput={(props) => (
              <input
                {...props}
                placeholder=""
                style={{
                  width: "100%",
                  maxWidth: "60px",
                  gap: "1px"
                }}
                className="h-[60px] sm:h-[64px] border border-gray-300 rounded-lg text-lg font-medium text-center bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
              />
            )}
            containerStyle={{
              justifyContent: "space-between",
              gap: "0 6px",
              flexWrap: "wrap",
            }}
          />

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            Verify Email
          </button>
        </form>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600 gap-4 sm:gap-0">
          <Link to="/signup" className="flex items-center gap-1 hover:text-indigo-500">
            ←
            <span>Back to Signup</span>
          </Link>

          {resendTimer > 0 ? (
            <span className="flex items-center gap-1 text-gray-400">
              ⏱
              {resendTimer}s
            </span>
          ) : (
            <button
              onClick={handleResendOtp}
              className="text-indigo-500 flex items-center gap-1 hover:underline"
            >
              ⏱
              Resend it
            </button>
          )}
        </div>
      </div>
    )}
  </div>
);

};

export default VerifyEmail;
