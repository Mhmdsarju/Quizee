import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../../api/axios";
import Loader from "../../components/Loader";

export default function AddQuizModal({ onClose, onSuccess }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [image, setImage] = useState(null);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/admin/categories");
        setCategories(res.data.data || res.data);
      } catch (err) {
        console.error("Category fetch failed", err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async () => {
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

    const res = await api.post("/admin/quiz", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    Swal.fire("Success", "Quiz added successfully", "success");
    onSuccess(res.data.quiz);
    onClose(); 
  } catch (err) {
    Swal.fire(
      "Error",
      err.response?.data?.message || "Quiz creation failed",
      "error"
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-semibold text-blue-quiz">Add Quiz</h2>
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

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />

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
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 text-sm rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? <Loader/> : "Add Quiz"}
          </button>
        </div>
      </div>
    </div>
  );
}
