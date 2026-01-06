import Swal from "sweetalert2";
import api from "../../../api/axios"; 

export default function UserRow({ _id, name, email, role, isBlocked, onRefresh }) {

  const handleBlockToggle = async () => {
    const result = await Swal.fire({
      title: isBlocked ? "Unblock user?" : "Block user?",
      text: isBlocked
        ? "This user will regain access."
        : "This user will not be able to login.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isBlocked ? "#16a34a" : "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: isBlocked ? "Yes, Unblock" : "Yes, Block",
    });

    if (!result.isConfirmed) return;

    try {
      await api.patch(`/admin/users/${_id}/block`);

      Swal.fire({
        title: isBlocked ? "Unblocked!" : "Blocked!",
        text: `User has been ${isBlocked ? "unblocked" : "blocked"} successfully.`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      onRefresh(_id); 
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Something went wrong", "error");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[70px_240px_100px_110px_1fr] items-center gap-y-2">

      <div className="hidden md:block text-xs text-gray-400">
        #{_id.slice(-4)}
      </div>

      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-xs font-semibold">
          {name.charAt(0)}
        </div>
        <div className="leading-tight">
          <p className="text-sm font-medium">{name}</p>
          <p className="text-[11px] text-gray-400">{email}</p>
        </div>
      </div>

      <div className="text-xs text-gray-300">{role}</div>

      <div>
        <span
          className={`px-2 py-[2px] rounded-full text-[11px] font-medium
            ${
              isBlocked
                ? "bg-red-500/20 text-red-400"
                : "bg-green-500/20 text-green-400"
            }`}
        >
          {isBlocked ? "Blocked" : "Active"}
        </span>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleBlockToggle}
          className={`px-3 h-8 rounded-md text-xs font-medium
            ${
              isBlocked
                ? "bg-green-600/20 text-green-400 hover:bg-green-600/30"
                : "bg-red-600/20 text-red-400 hover:bg-red-600/30"
            }`}
        >
          {isBlocked ? "Unblock" : "Block"}
        </button>
      </div>

    </div>
  );
}
