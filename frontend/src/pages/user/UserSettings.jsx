import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { changePassword } from "../../api/authApi";


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
      await changePassword({oldPassword,newPassword,});

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

      <div onClick={() => setOpen(true)}className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded hover:bg-green-900 flex justify-between bg-green-700 shadow-2xl">
         <p>change password</p>
         <p>{'>'}</p>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl p-6 space-y-4 relative">

            <h2 className="text-xl font-semibold text-center">
              Change Password
            </h2>

            <div className="relative">
              <input
                type={showOld ? "text" : "password"}
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full border px-3 py-2 rounded pr-10"
              />
              <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700">
                {showOld ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
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

            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border px-3 py-2 rounded pr-10"
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700">
                {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            <div className="text-right">
              <button onClick={() => navigate("/forgot-password")}className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </button>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button onClick={() => setOpen(false)}className="px-4 py-2 border rounded">
                Cancel
              </button>

              <button onClick={handleSave}className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Save
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
