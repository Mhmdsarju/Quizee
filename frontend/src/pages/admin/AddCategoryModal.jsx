import { useState } from "react";
import Swal from "sweetalert2";
import { createCategories } from "../../api/categoryApi";

export default function AddCategoryModal({ onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
   
  const handleSubmit = async () => {
    if (!name.trim()) {
      return Swal.fire("Error", "Category name required", "error");
    }
     let newCategory;
    try {
      setLoading(true);
      const res = await createCategories({ name });
      newCategory = res.data; 
    } catch (err) {
      setLoading(false);
      return Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to create category",
        "error"
      );
    }
    Swal.fire({
      icon: "success",
      title: "Added!",
      text: "Category created successfully",
      timer: 1200,
      showConfirmButton: false,
    });

    setLoading(false);
    onSuccess(newCategory);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-blue-quiz w-full max-w-sm rounded-lg p-5">
        <h2 className="text-sm font-semibold mb-4 text-quiz-main">
          Add Category
        </h2>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          className="w-full h-10 px-3 rounded-md  text-sm mb-4"
          autoFocus
        />

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 h-9 text-sm rounded-md bg-red-500 shadow text-white"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 h-9 text-sm rounded-md bg-blue-600 text-white shadow
                       hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
