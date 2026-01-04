import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../redux/authSlice";

export default function ResetPassword() {
  const { state } = useLocation();
  const email = state?.email;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.auth);

  const [password, setPassword] = useState("");

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
        <h2 className="text-xl font-bold text-center mb-4">
          Reset Password
        </h2>

        <input
          type="password"
          placeholder="New password"
          className="w-full px-4 py-2 rounded mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p className="text-red-500 text-sm text-center">
            {error}
          </p>
        )}

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}
