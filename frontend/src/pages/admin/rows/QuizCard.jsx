import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../../api/axios";
import EditQuizModal from "../EditQuizModal";
import QuizImg from "../../../assets/quiz.jpg";

export default function QuizCard({_id,title,description,category,timeLimit,image,isActive,onToggle,onEdit,questionCount,}) {
  const [openEdit, setOpenEdit] = useState(false);
  const navigate = useNavigate();

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
        <div className="h-36 w-full overflow-hidden">
          <img
            src={image || QuizImg}
            alt={title}
            className="w-full h-full object-cover"
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
            <span className="text-xs text-gray-300">
              {questionCount || 0} Questions
            </span>
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
              onClick={() => navigate(`/admin/quizzes/${_id}/questions`)}
              className="flex-1 text-sm bg-indigo-600 hover:bg-indigo-700 rounded-lg py-2"
            >
              ❓ Questions
            </button>

            <button
              onClick={() => setOpenEdit(true)}
              className="w-10 flex items-center justify-center bg-[#3B356A] hover:bg-[#4C4591] rounded-lg"
              title="Edit Quiz"
            >
              ✏️
            </button>

            <button
              onClick={handleToggleStatus}
              className="w-10 flex items-center justify-center bg-[#3B356A] hover:bg-red-600 rounded-lg"
              title={isActive ? "Block Quiz" : "Unblock Quiz"}
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
