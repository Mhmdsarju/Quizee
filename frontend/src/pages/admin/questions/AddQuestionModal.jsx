import { useState } from "react";
import Swal from "sweetalert2";
import api from "../../../api/axios";

export default function AddQuestionModal({ quizId, onClose, onSuccess }) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(0);

  const handleSubmit = async () => {
    if (!question || options.some((o) => !o)) {
      return Swal.fire("Error", "Fill all fields", "error");
    }

    await api.post("/admin/questions", {quizId,question,options,correctAnswer,});

    Swal.fire("Success", "Question added", "success");
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded w-full max-w-md space-y-3">
        <h2 className="font-semibold">Add Question</h2>

        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Question"
          className="w-full border p-2"
        />

        {options.map((op, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input value={op} onChange={(e) => {const copy = [...options];copy[i] = e.target.value;setOptions(copy);}}
              placeholder={`Option ${i + 1}`}
              className="flex-1 border p-2"
            />
            <input
              type="radio"
              checked={correctAnswer === i}
              onChange={() => setCorrectAnswer(i)}
            />
          </div>
        ))}

        <div className="flex justify-end gap-3">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
