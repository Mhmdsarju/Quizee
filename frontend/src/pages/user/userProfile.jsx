import { useSelector } from "react-redux";
import {
  FaUser,
  FaEnvelope,
  FaGift,
  FaCopy,
} from "react-icons/fa";
import { useState } from "react";
import EditProfileModal from "./EditProfileModal";

export default function ProfilePage() {
  const [openEdit, setOpenEdit] = useState(false);
  const [copied, setCopied] = useState(false);

  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-gray-400">
        No user data found
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      {/* Header */}
      <h1 className="text-sm sm:text-base md:text-lg font-semibold text-blue-quiz mb-6 flex items-center justify-between">
        My Profile
        <button
          onClick={() => setOpenEdit(true)}
          className="text-xs px-3 py-1 rounded-md bg-quiz-main text-blue-quiz"
        >
          Edit
        </button>
      </h1>

      {openEdit && (
        <EditProfileModal user={user} onClose={() => setOpenEdit(false)} />
      )}

      {/* Profile Card */}
      <div className="bg-[#241d3b] rounded-xl p-6 shadow-lg space-y-6">
        {/* Avatar + Name */}
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-purple-600 flex items-center justify-center text-xl font-semibold text-white">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-white font-medium">{user.name}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
        </div>

        {/* Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-3 bg-[#1b1630] rounded-md px-4 py-3">
            <FaUser className="text-gray-400" />
            <div>
              <p className="text-gray-400 text-xs">Name</p>
              <p className="text-white">{user.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#1b1630] rounded-md px-4 py-3">
            <FaEnvelope className="text-gray-400" />
            <div>
              <p className="text-gray-400 text-xs">Email</p>
              <p className="text-white">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= Referral Code Section ================= */}
      <div className="bg-[#241d3b] rounded-xl p-6 shadow-lg mt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaGift className="text-yellow-400" />
            <div>
              <p className="text-gray-400 text-xs">Your Referral Code</p>
              <p className="text-white text-lg font-semibold tracking-widest">
                {user.referralCode || "—"}
              </p>
            </div>
          </div>

          {user.referralCode && (
            <button
              onClick={() => {
                navigator.clipboard.writeText(user.referralCode);
                setCopied(true);

                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
              className={`flex items-center gap-2 text-xs px-3 py-2 rounded-md transition
                ${
                  copied
                    ? "bg-green-500 text-white"
                    : "bg-quiz-main text-blue-quiz hover:opacity-90"
                }`}
            >
              <FaCopy />
              {copied ? "Copied" : "Copy"}
            </button>
          )}
        </div>

        <p className="text-[11px] text-gray-400 mt-3">
          Invite your friends using this referral code and earn rewards when they
          win paid contests 🎉
        </p>
      </div>
      {/* ========================================================== */}
    </div>
  );
}
