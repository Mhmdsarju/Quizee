import { useSelector } from "react-redux";
import { FaUser, FaEnvelope, FaShieldAlt } from "react-icons/fa";

export default function ProfilePage() {
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
      <h1 className="text-sm sm:text-base md:text-lg font-semibold text-blue-quiz mb-6">
        My Profile
      </h1>

      <div className="bg-[#241d3b] rounded-xl p-6 shadow-lg space-y-6">
        
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-purple-600 flex items-center justify-center text-xl font-semibold text-white">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-white font-medium">{user.name}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
        </div>

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

          <div className="flex items-center gap-3 bg-[#1b1630] rounded-md px-4 py-3">
            <FaShieldAlt className="text-gray-400" />
            <div>
              <p className="text-gray-400 text-xs">Role</p>
              <p className="text-white capitalize">{user.role}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
