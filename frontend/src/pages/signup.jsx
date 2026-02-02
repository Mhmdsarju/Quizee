import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../redux/authSlice";
import { useNavigate, Link } from "react-router-dom";
import quizImg from "../assets/quiz1.webp";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "../schema/signupSchema";
import Loader from "../components/Loader";

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);

  const {register,  handleSubmit,formState: { errors }} = useForm({
    resolver: zodResolver(signupSchema),
  });

  const submit = async (data) => {
    const res = await dispatch(signupUser(data));

    if (signupUser.fulfilled.match(res)) {
      navigate("/verify-otp", {
        state: { email: data.email },
      });
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <Loader />
        </div>
      )}
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl p-6">

          <h2 className="text-2xl font-bold text-center text-blue-quiz">
            Create Account
          </h2>
          <p className="text-center text-sm text-gray-500 mt-1">
            Welcome to the Quiz community
          </p>

          <form
            onSubmit={handleSubmit(submit)}
            className="mt-6 space-y-4 bg-blue-quiz p-7 rounded-xl shadow-2xl"
          >
            <div>
              <label className="block text-sm font-medium text-quiz-main mb-1">
                Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                {...register("name")}
                className="w-full rounded-lg border px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-quiz"
              />
              {errors.name && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-quiz-main mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className="w-full rounded-lg border px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-quiz"
              />
              {errors.email && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-quiz-main mb-1">
                Password
              </label>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password")}
                className="w-full rounded-lg border px-4 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-blue-quiz"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>

              {errors.password && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-quiz-main mb-1">
                Referral (optional)
              </label>
              <input
                type="text"
                placeholder="Referral code"
              
                className="w-full rounded-lg border px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-quiz"
              />
            </div>
            {error && (
              <p className="text-sm text-red-500 text-center">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-lg py-2 font-semibold transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-quiz-main text-blue-quiz hover:opacity-90"
              }`}
            >
              {loading ? "Creating..." : "Create Account"}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/30" />
              <span className="text-xs text-quiz-main">OR</span>
              <div className="flex-1 h-px bg-white/30" />
            </div>

            <button
              type="button"
              onClick={() => {window.location.href ="http://localhost:5005/api/auth/google"}}
              className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-100 transition"
            >
              <FcGoogle className="text-xl" />
              Continue with Google
            </button>
          </form>

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
