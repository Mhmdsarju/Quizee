import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const submit = async (e) => {
    e.preventDefault();

    const res = await dispatch(forgotPassword({ email }));
    if (forgotPassword.fulfilled.match(res)) {
      navigate("/forgot-password/verify-otp", {state: { email },replace:true});
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={submit}
        className="bg-blue-quiz p-6 rounded-xl w-96"
      >
        <h2 className="text-xl font-bold text-center mb-4 text-quiz-main">
          Forgot Password
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full px-4 py-2 rounded mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {error && (
          <p className="text-red-500 text-sm text-center">
            {error}
          </p>
        )}

        <button
          disabled={loading}
          className="w-full bg-quiz-main text-blue-quiz py-2 rounded"
        >
          {loading ? "Sending OTP..." : "Send OTP" }
        </button>
      </form>
    </div>
  );
}
