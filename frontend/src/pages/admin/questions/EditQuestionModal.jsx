import { useState } from "react";
import Swal from "sweetalert2";
import api from "../../../api/axios";

export default function EditQuestionModal({ question, onClose, onSuccess }) {
  const [qText, setQText] = useState(question.question);
  const [options, setOptions] = useState([...question.options]);
  const [correctAnswer, setCorrectAnswer] = useState(
    question.correctAnswer
  );

  const handleUpdate = async () => {
    await api.put(`/admin/questions/${question._id}`, {
      question: qText,
      options,
      correctAnswer,
    });

    Swal.fire("Updated", "Question updated", "success");
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded w-full max-w-md space-y-3">
        <h2 className="font-semibold">Edit Question</h2>

        <input value={qText} onChange={(e) => setQText(e.target.value)}className="w-full border p-2"/>

        {options.map((op, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input value={op} onChange={(e) => { 
                const copy = [...options];
                copy[i] = e.target.value;
                setOptions(copy);
              }}
              className="flex-1 border p-2"
            />
            <input type="radio" checked={correctAnswer === i} onChange={() => setCorrectAnswer(i)}/>
          </div>
        ))}

        <div className="flex justify-end gap-3">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleUpdate} className="bg-blue-600 text-white px-4 py-2 rounded">
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
