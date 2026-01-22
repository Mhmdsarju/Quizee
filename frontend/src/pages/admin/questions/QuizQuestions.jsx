import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../../api/axios";
import AddQuestionModal from "./AddQuestionModal";
import EditQuestionModal from "./EditQuestionModal";
import CsvQuestionUpload from "../../../components/CsvQuestionUpload";


export default function QuizQuestions() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [editQuestion, setEditQuestion] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/questions/${quizId}`);
      setQuestions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [quizId]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete question?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    });

    if (!result.isConfirmed) return;

    await api.delete(`/admin/questions/${id}`);

    Swal.fire("Deleted", "Question removed", "success");
    fetchQuestions();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-semibold text-blue-quiz">
          Question Management
        </h1>

        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-sm border rounded"
          >
            ← Back
          </button>

          <button
            onClick={() => setOpenAdd(true)}
            className="px-4 py-2 text-sm bg-green-600 text-white rounded"
          >
            + Add Question
          </button>
        </div>
      </div>

      <CsvQuestionUpload quizId={quizId} onSuccess={fetchQuestions} />

      {loading ? (
        <p className="text-sm text-gray-400 mt-6">Loading questions...</p>
      ) : questions.length === 0 ? (
        <p className="text-sm text-gray-400 mt-6">
          No questions added yet
        </p>
      ) : (
        <div className="space-y-4 mt-6">
          {questions.map((q, index) => (
            <div
              key={q._id}
              className="bg-[#2B2450] p-4 rounded text-white"
            >
              <p className="font-medium">
                {index + 1}. {q.question}
              </p>

              <ul className="mt-2 ml-4 space-y-1">
                {q.options.map((op, i) => (
                  <li
                    key={i}
                    className={
                      i === q.correctAnswer
                        ? "text-green-400"
                        : "text-gray-300"
                    }
                  >
                    {String.fromCharCode(65 + i)}. {op}
                  </li>
                ))}
              </ul>

              <div className="flex gap-4 mt-3">
                <button
                  onClick={() => setEditQuestion(q)}
                  className="text-sm text-blue-400"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(q._id)}
                  className="text-sm text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {openAdd && (
        <AddQuestionModal
          quizId={quizId}
          onClose={() => setOpenAdd(false)}
          onSuccess={fetchQuestions}
        />
      )}

      {editQuestion && (
        <EditQuestionModal
          question={editQuestion}
          onClose={() => setEditQuestion(null)}
          onSuccess={fetchQuestions}
        />
      )}
    </div>
  );
}
