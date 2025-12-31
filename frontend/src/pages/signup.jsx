import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../redux/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import quizImg from "../assets/quiz1.webp";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    referral: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e) => {
  e.preventDefault();

  const res = await dispatch(signupUser(form));

  if (signupUser.fulfilled.match(res)) {
    navigate("/", { replace: true }); 
  }
};

  return (
    <>
      <img
        src={quizImg}
        alt="Quiz"
        className="hidden md:block h-[120px] absolute -rotate-12 opacity-70 "
      />

      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl p-6">

          <h2 className="text-2xl font-bold text-center text-blue-quiz">
            Create Account
          </h2>
          <p className="text-center text-sm text-gray-500 mt-1">
            Welcome to the Quiz community
          </p>

          {/* Form */}
          <form
            onSubmit={submit}
            className="mt-6 space-y-4 bg-blue-quiz p-7 rounded-xl shadow-2xl"
          >
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-quiz-main mb-1">
                Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full rounded-lg border px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-quiz"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-quiz-main mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-quiz"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
              />
            </div>

            {/* Password with Eye Toggle */}
            <div className="relative">
              <label className="block text-sm font-medium text-quiz-main mb-1">
                Password
              </label>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full rounded-lg border px-4 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-blue-quiz"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Referral */}
            <div>
              <label className="block text-sm font-medium text-quiz-main mb-1">
                Referral (optional)
              </label>
              <input
                type="text"
                placeholder="Referral code"
                className="w-full rounded-lg border px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-quiz"
                value={form.referral}
                onChange={(e) =>
                  setForm({ ...form, referral: e.target.value })
                }
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-500 text-center">
                {error}
              </p>
            )}

            {/* Signup Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-lg py-2 font-semibold transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-quiz-main text-blue-quiz hover:opacity-90"
              }`}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/30" />
              <span className="text-xs text-quiz-main">OR</span>
              <div className="flex-1 h-px bg-white/30" />
            </div>

            {/* Google Signup */}
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
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-quiz font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
