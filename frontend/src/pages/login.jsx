import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/authSlice";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useState } from "react";
import quizImg from "../assets/quiz1.webp";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, accessToken } = useSelector(
    (state) => state.auth
  );

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  if (accessToken) {
    return <Navigate to="/" replace />;
  }

  const submit = async (e) => {
  e.preventDefault();

  const res = await dispatch(loginUser(data));

  if (res.meta.requestStatus === "fulfilled") {
    const role = res.payload.user.role;

    if (role === "admin") {
      navigate("/admin", { replace: true });
    } else {
      navigate("/", { replace: true }); 
    }
  }
};

  return (
    <>
      {/* Decorative image – desktop only */}
      <img
        src={quizImg}
        alt="Quiz"
        className="hidden md:block h-[120px] absolute -rotate-12 opacity-70"
      />

      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl p-6">

          {/* Title */}
          <h2 className="text-2xl font-bold text-center text-blue-quiz">
            Welcome Back
          </h2>
          <p className="text-center text-sm text-gray-500 mt-1">
            Login to continue your quiz journey
          </p>

          {/* Form */}
          <form
            onSubmit={submit}
            className="mt-6 space-y-4 bg-blue-quiz p-7 rounded-xl shadow-xl"
          >
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-quiz-main mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-quiz"
                value={data.email}
                onChange={(e) =>
                  setData({ ...data, email: e.target.value })
                }
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-quiz-main mb-1">
                Password
              </label>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full rounded-lg border px-4 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-blue-quiz"
                value={data.password}
                onChange={(e) =>
                  setData({ ...data, password: e.target.value })
                }
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-xs text-quiz-main hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-500 text-center">
                {error}
              </p>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-lg py-2 font-semibold transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-quiz-main text-blue-quiz hover:opacity-90"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/30" />
              <span className="text-xs text-quiz-main">OR</span>
              <div className="flex-1 h-px bg-white/30" />
            </div>

            {/* Google Login */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-100 transition"
            >
              <FcGoogle className="text-xl" />
              Continue with Google
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-4">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-quiz font-medium hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
