import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../redux/authSlice";
import { Eye, EyeOff } from "lucide-react"; // 👈 icon

export default function ResetPassword() {
  const { state } = useLocation();
  const email = state?.email;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.auth);

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    const res = await dispatch(
      resetPassword({ email, password })
    );

    if (resetPassword.fulfilled.match(res)) {
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <form
        onSubmit={submit}
        className="bg-blue-quiz p-6 rounded-xl w-96"
      >
        <h2 className="text-xl font-bold text-center mb-4 text-quiz-main">
          Reset Password
        </h2>
        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New password"
            className="w-full px-4 py-2 rounded pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mb-2">
            {error}
          </p>
        )}

        <button
          disabled={loading}
          className="w-full bg-quiz-main text-blue-quiz py-2 rounded disabled:opacity-60"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
