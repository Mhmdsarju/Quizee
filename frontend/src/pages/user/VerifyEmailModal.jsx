import { useState } from "react";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/authSlice";
import Loader from "../../components/Loader";
import { otpVerify, resendOtpApi } from "../../api/authApi";

export default function VerifyEmailModal({ email, name, onClose }) {
  const dispatch = useDispatch();

  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  const verifyOtp = async () => {
    if (!otp) return;

    try {
      setVerifying(true);
      const res = await otpVerify({email,otp,purpose: "email-change",});

      dispatch(updateUser(res.data.user));

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Profile updated successfully",
        timer: 1500,
        showConfirmButton: false,
      });

      onClose();
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Invalid OTP",
        "error"
      );
    } finally {
      setVerifying(false);
    }
  };

  const resendOtp = async () => {
    try {
      setResending(true);

  await resendOtpApi({email,purpose: "email-change"});

      Swal.fire("OTP Sent", "A new OTP has been sent", "success");
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to resend OTP",
        "error"
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" />
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-[#241d3b] p-6 rounded-xl w-full max-w-sm space-y-4">
          <h2 className="text-white font-semibold">Verify Email</h2>

          <input
            className="w-full px-3 py-2 rounded-md bg-[#1b1630] text-white"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            disabled={verifying || resending}
          />

          <div className="flex justify-between items-center text-xs">
            <button
              onClick={resendOtp}
              disabled={resending || verifying}
              className={`flex items-center gap-2 ${
                resending
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-400"
              }`}
            >
              {resending && (
                <span className="h-3 w-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              )}
              {resending ? "Sending..." : "Resend OTP"}
            </button>

            <div className="flex gap-4">

              <button
                onClick={onClose}
                disabled={verifying || resending}
                className={`${
                  verifying || resending
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-red-400"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={verifyOtp}
                disabled={verifying || resending}
                className={`flex items-center gap-2 ${
                  verifying
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-green-400"
                }`}
              >
                {verifying && (
                  <span className="h-3 w-3 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                )}
                {verifying ? <Loader /> : "Verify"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
