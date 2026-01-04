import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import {verifyForgotOtp,resendForgotOtp } from "../redux/authSlice";

export default function ForgotOtp() {
  const { state } = useLocation();
  const email = state?.email;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [time, setTime] = useState(30);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (time === 0) return;
    const t = setInterval(() => setTime((t) => t - 1), 1000);
    return () => clearInterval(t);
  }, [time]);

  const submit = async () => {
    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) return;

    const res = await dispatch(
      verifyForgotOtp({ email, otp: finalOtp })
    );

    if (verifyForgotOtp.fulfilled.match(res)) {
      navigate("/reset-password", {
        state: { email },
        replace: true
      });
    }
  };
  const resend = () => {
    dispatch(resendForgotOtp({ email }));
    setTime(30);
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="bg-blue-quiz p-6 rounded-xl w-96">

        <h2 className="text-center text-xl font-bold text-quiz-main">
          Verify OTP
        </h2>

        <div className="flex gap-2 justify-between mt-4">
          {otp.map((v, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              className="w-12 h-12 text-center text-lg rounded"
              maxLength={1}
              value={v}
              onChange={(e) => {
                if (!/^\d?$/.test(e.target.value)) return;
                const n = [...otp];
                n[i] = e.target.value;
                setOtp(n);
                if (e.target.value && i < 5)
                  inputsRef.current[i + 1].focus();
              }}
            />
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-sm mt-3 text-center">
            {error}
          </p>
        )}

        <button
          disabled={loading}
          onClick={submit}
          className="w-full bg-quiz-main text-blue-quiz py-2 mt-4 rounded"
        >
          Verify OTP ({time}s)
        </button>

        {time === 0 && (
          <button
            onClick={resend}
            className="w-full text-quiz-main mt-2"
          >
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
}
