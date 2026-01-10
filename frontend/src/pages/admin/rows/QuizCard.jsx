import { useState } from "react";
import Swal from "sweetalert2";
import api from "../../../api/axios";
import EditQuizModal from "../EditQuizModal";

export default function QuizCard({
  _id,
  title,
  description,
  category,
  timeLimit,
  image,
  isActive,
  onToggle,
  onEdit,
}) {
  const [openEdit, setOpenEdit] = useState(false);

  const handleToggleStatus = async () => {
    const result = await Swal.fire({
      title: isActive ? "Block quiz?" : "Unblock quiz?",
      confirmButtonText: "Yes",
      showCancelButton: true,
    });

    if (!result.isConfirmed) return;

    await api.patch(`/admin/quiz/${_id}/status`);
    onToggle(_id);
  };

  return (
    <>
      <div className="rounded-2xl overflow-hidden bg-[#2B2450] shadow-lg">
        <div className="h-36 bg-gradient-to-br from-[#0F172A] to-[#1E293B] flex items-center justify-center">
          <img
            src={image || "/quiz-placeholder.png"}
            alt={title}
            className="w-16 opacity-70"
          />
        </div>
        <div className="p-4 text-white">
          <div className="flex justify-between items-center mb-2">
            <span
              className={`text-xs px-3 py-1 rounded-full ${
                isActive
                  ? "bg-green-800 text-green-300"
                  : "bg-red-800 text-red-300"
              }`}
            >
              {isActive ? "Active" : "Blocked"}
            </span>
            <span className="text-xs text-gray-300">{timeLimit} mins</span>
          </div>

          <h3 className="font-semibold text-base">{title}</h3>
          <p className="text-sm text-gray-300 mt-1 line-clamp-2">
            {description || "No description"}
          </p>

          <p className="text-xs text-gray-400 mt-2">
            Category: {category?.name}
          </p>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setOpenEdit(true)}
              className="flex-1 flex items-center justify-center gap-1 text-sm bg-[#3B356A] hover:bg-[#4C4591] rounded-lg py-2"
            >
              ✏️ Edit
            </button>

            <button
              onClick={handleToggleStatus}
              className="w-10 flex items-center justify-center bg-[#3B356A] hover:bg-red-600 rounded-lg"
            >
              🗑
            </button>
          </div>
        </div>
      </div>

      {openEdit && (
        <EditQuizModal
          quizId={_id}
          onClose={() => setOpenEdit(false)}
          onSuccess={onEdit}
        />
      )}
    </>
  );
}
