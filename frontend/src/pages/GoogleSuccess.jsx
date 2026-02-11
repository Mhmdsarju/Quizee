import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setCredentials } from "../redux/authSlice";

export default function GoogleSuccess() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const token = params.get("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    dispatch(
      setCredentials({
        accessToken: token,
      })
    );

    navigate("/", { replace: true });
  }, []);

  return (
    <div className="h-screen flex items-center justify-center text-gray-400">
      Logging in with Google.....
    </div>
  );
}
