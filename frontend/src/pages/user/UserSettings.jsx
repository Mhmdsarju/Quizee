import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Swal from "sweetalert2";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function UserSettings() {
  const [open, setOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  const handleSave = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      return Swal.fire("Error", "All fields are required", "error");
    }

    if (newPassword !== confirmPassword) {
      return Swal.fire("Error", "Passwords do not match", "error");
    }

    try {
      await api.patch("/user/change-password", {
        oldPassword,
        newPassword,
      });

      Swal.fire("Success", "Password updated successfully", "success");
      setOpen(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      if (err.response?.data?.message === "Old password incorrect") {
        Swal.fire("Error", "Old password is wrong", "error");
      } else {
        Swal.fire("Error", "Failed to update password", "error");
      }
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>

      <button
        onClick={() => setOpen(true)}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Change Password
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl p-6 space-y-4 relative">

            <h2 className="text-xl font-semibold text-center">
              Change Password
            </h2>

            {/* Old Password */}
            <div className="relative">
              <input
                type={showOld ? "text" : "password"}
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full border px-3 py-2 rounded pr-10"
              />
              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showOld ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>

            {/* New Password */}
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border px-3 py-2 rounded pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showNew ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border px-3 py-2 rounded pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>

            {/* Forgot password */}
            <div className="text-right">
              <button
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
