import { useState } from "react";
import api from "../../api/axios";
import VerifyEmailModal from "./VerifyEmailModal";
import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/authSlice";
import Swal from "sweetalert2";

export default function EditProfileModal({ user, onClose }) {
  const dispatch = useDispatch();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [openOtp, setOpenOtp] = useState(false);
  const [loading, setLoading] = useState(false); 

  const handleSave = async () => {
    try {
      setLoading(true); 
      if (email === user.email) {
        const res = await api.patch("/user/profile", { name });

        dispatch(updateUser(res.data.user));

        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Profile updated successfully",
          timer: 1500,
          showConfirmButton: false,
        });

        onClose();
        return;
      }

      await api.post("/auth/send-otp", {
        email,
        purpose: "email-change",
      });

      setOpenOtp(true);

    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Something went wrong",
        "error"
      );
    } finally {
      setLoading(false); 
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" />

      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-[#241d3b] p-6 rounded-xl w-full max-w-md space-y-4">
          <h2 className="text-white font-semibold">Edit Profile</h2>

          <input
            className="w-full px-3 py-2 rounded-md bg-[#1b1630] text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            disabled={loading}
          />

          <input
            className="w-full px-3 py-2 rounded-md bg-[#1b1630] text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            disabled={loading}
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="text-gray-400"
              disabled={loading}
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={loading}
              className={`px-4 py-1 rounded-md flex items-center gap-2
                ${
                  loading
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-quiz-main text-blue-quiz"
                }`}
            >
              {loading && (
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>

      {openOtp && (
        <VerifyEmailModal
          email={email}
          name={name}
          onClose={onClose}
        />
      )}
    </>
  );
}
