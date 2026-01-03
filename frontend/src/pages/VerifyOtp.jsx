import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {  verifyOtp } from "../redux/authSlice";


export default function VerifyOtp() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, accessToken } = useSelector((s) => s.auth);

  const [otp, setOtp] = useState("");
  const [time, setTime] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((t) => t - 1);
    }, 1000);

    if (time === 0) clearInterval(timer);
    return () => clearInterval(timer);
  }, [time]);

  useEffect(() => {
    if (accessToken) {
      navigate("/", { replace: true });
    }
  }, [accessToken, navigate]);

  const submit = () => {
    dispatch(
      verifyOtp({
        email: state.email,
        otp
      })
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-[350px] bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold text-center">Verify OTP</h2>

        <p className="text-sm text-center text-gray-600 mt-1">
          OTP sent to {state.email}
        </p>

        <input
          className="border p-2 w-full mt-4 rounded"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        {error && (
          <p className="text-red-500 text-sm mt-2 text-center">
            {error}
          </p>
        )}

        <button
          onClick={submit}
          disabled={loading || time === 0}
          className="w-full bg-blue-600 text-white py-2 mt-4 rounded"
        >
          {loading ? "Verifying..." : `Verify OTP (${time}s)`}
        </button>
      </div>
    </div>
  );
}
