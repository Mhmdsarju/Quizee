import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../../api/axios";

export default function EditQuizModal({ quizId, onClose, onSuccess }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [image, setImage] = useState(null);      // file
  const [oldImage, setOldImage] = useState(""); // cloudinary url

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizRes, catRes] = await Promise.all([
          api.get(`/admin/quiz/${quizId}`),
          api.get("/admin/categories"),
        ]);

        const quiz = quizRes.data;

        setTitle(quiz.title);
        setDescription(quiz.description || "");
        setCategory(quiz.category?._id || quiz.category);
        setTimeLimit(quiz.timeLimit);
        setOldImage(quiz.image || "");

        setCategories(catRes.data.data || catRes.data);
      } catch (err) {
        Swal.fire("Error", "Failed to load quiz", "error");
        onClose();
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [quizId, onClose]);

  const handleUpdate = async () => {
    if (!title || !category || !timeLimit) {
      return Swal.fire("Error", "Required fields missing", "error");
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("timeLimit", timeLimit);

      if (image) {
        formData.append("image", image);
      }

      const res = await api.put(`/admin/quiz/${quizId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire("Updated", "Quiz updated successfully", "success");
      onSuccess(res.data.quiz);
      onClose();
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Update failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white p-6 rounded text-sm">
          Loading quiz...
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-semibold text-blue-quiz">
            Edit Quiz
          </h2>
          <button onClick={onClose} className="text-gray-500 text-sm">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Quiz Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          />

          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          />

          {/* Image Upload */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />

          {/* Preview */}
          {(image || oldImage) && (
            <img
              src={image ? URL.createObjectURL(image) : oldImage}
              alt="Preview"
              className="h-32 w-full object-cover rounded"
            />
          )}

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Time Limit (minutes)"
            value={timeLimit}
            onChange={(e) => setTimeLimit(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded border"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Quiz"}
          </button>
        </div>
      </div>
    </div>
  );
}
