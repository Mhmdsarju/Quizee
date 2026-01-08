import { useState } from "react";
import Swal from "sweetalert2";
import { deleteCategories } from "../../../api/categoryApi";
import EditCategoryModal from "../EditCategoryModal";

export default function CategoryRow({
  _id,
  name,
  isActive,
  onRefresh,
  onEdit,
}) {
  const [openEdit, setOpenEdit] = useState(false);

  const handleToggleStatus = async () => {
    const result = await Swal.fire({
      title: isActive ? "Disable category?" : "Enable category?",
      text: isActive
        ? "This category will be hidden from users."
        : "This category will be visible to users.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isActive ? "#dc2626" : "#16a34a",
      cancelButtonColor: "#6b7280",
      confirmButtonText: isActive ? "Yes, Disable" : "Yes, Enable",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteCategories(_id);

      Swal.fire({
        title: "Updated!",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });

      // ✅ instant UI toggle
      onRefresh(_id);
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to update category",
        "error"
      );
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-[70px_240px_100px_110px_1fr] items-center gap-y-2">
        <div className="hidden md:block text-xs text-gray-400">
          #{_id.slice(-4)}
        </div>

        <div className="text-sm font-medium text-white">
          {name}
        </div>

        <div>
          <span
            className={`px-2 py-[2px] rounded-full text-[11px] font-medium ${
              isActive
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => setOpenEdit(true)}
            className="px-3 h-8 rounded-md text-xs font-medium
                       bg-blue-600/20 text-blue-400 hover:bg-blue-600/30"
          >
            Edit
          </button>

          <button
            onClick={handleToggleStatus}
            className={`px-3 h-8 rounded-md text-xs font-medium ${
              isActive
                ? "bg-red-600/20 text-red-400 hover:bg-red-600/30"
                : "bg-green-600/20 text-green-400 hover:bg-green-600/30"
            }`}
          >
            {isActive ? "Disable" : "Enable"}
          </button>
        </div>
      </div>

      {openEdit && (
        <EditCategoryModal
          id={_id}
          currentName={name}
          onClose={() => setOpenEdit(false)}
          onSuccess={(updatedCategory) => {
            onEdit(updatedCategory); // ✅ update parent list
            setOpenEdit(false);
          }}
        />
      )}
    </>
  );
}
