import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { verifyOtp, resendOtp } from "../redux/authSlice";

export default function VerifyOtp() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, accessToken } = useSelector((s) => s.auth);

  const email =
    state?.email || sessionStorage.getItem("verifyEmail");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [time, setTime] = useState(60);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (!email) {
      navigate("/signup", { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    if (time === 0) return;

    const timer = setInterval(() => {
      setTime((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [time]);

  useEffect(() => {
    if (accessToken) {
      sessionStorage.removeItem("verifyEmail");
      navigate("/", { replace: true });
    }
  }, [accessToken, navigate]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d{6}$/.test(paste)) return;

    setOtp(paste.split(""));
    inputsRef.current[5].focus();
  };

  const submit = () => {
    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) return;

    dispatch(
      verifyOtp({
        email,
        otp: finalOtp,
        purpose: "signup"
      })
    );
  };

  const resend = () => {
    dispatch(resendOtp({ email }));
    setOtp(["", "", "", "", "", ""]);
    setTime(60);
    inputsRef.current[0]?.focus();
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-[380px] bg-blue-quiz p-6 rounded-2xl shadow-lg">

        <h2 className="text-2xl font-bold text-center text-quiz-main">
          Verify OTP
        </h2>

        <p className="text-sm text-center text-quiz-main mt-1">
          OTP sent to <span className="font-medium">{email}</span>
        </p>

        <div
          className="flex justify-between gap-2 mt-6"
          onPaste={handlePaste}
        >
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              value={digit}
              maxLength={1}
              onChange={(e) =>
                handleChange(e.target.value, index)
              }
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-center text-xl font-semibold border rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-sm mt-3 text-center">
            {error}
          </p>
        )}

        <button
          onClick={submit}
          disabled={loading}
          className={`w-full py-2 mt-6 rounded-lg text-white font-medium transition
            ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {loading ? "Verifying..." : `Verify OTP (${time}s)`}
        </button>


        {time === 0 && (
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">
              OTP expired
            </p>
            <button
              onClick={resend}
              className="text-sm text-quiz-main hover:underline mt-1"
            >
              Resend OTP
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
