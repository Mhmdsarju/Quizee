import { useState } from "react";
import Swal from "sweetalert2";
import { updateCategories } from "../../api/categoryApi";

export default function EditCategoryModal({
  id,
  currentName,
  onClose,
  onSuccess,
}) {
  const [name, setName] = useState(currentName);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!name.trim()) {
      return Swal.fire("Error", "Category name required", "error");
    }

    try {
      setLoading(true);

      const { data } = await updateCategories(id, { name });

      Swal.fire({
        icon: "success",
        title: "Updated!",
        timer: 1200,
        showConfirmButton: false,
      });

      // ✅ SAFE updated category object (fallback added)
      const updatedCategory = data?.category ?? {
        _id: id,
        name,
      };

      onSuccess(updatedCategory); // ✅ always valid
      onClose(); // ✅ modal close
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to update category",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="w-full max-w-sm rounded-xl p-5 bg-slate-900 border border-slate-700">
        <h2 className="text-sm font-semibold mb-4 text-white">
          Edit Category
        </h2>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full h-10 px-3 rounded-md bg-slate-800 text-white
                     border border-slate-600 focus:ring-2 focus:ring-blue-600
                     mb-4"
          autoFocus
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 h-9 text-sm rounded-md bg-slate-700 text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            disabled={loading}
            className="px-4 h-9 text-sm rounded-md bg-blue-600 text-white
                       hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
