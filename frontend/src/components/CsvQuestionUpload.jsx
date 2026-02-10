import { useState } from "react";
import Swal from "sweetalert2";
import api from "../api/axios";

const CsvQuestionUpload = ({ quizId, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      Swal.fire("Error", "Please select a CSV file", "error");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("quizId", quizId);

      const res = await api.post(
        "/admin/questions/upload-csv",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      await Swal.fire(
        "Success",
        `questions uploaded`,
        "success"
      );

      setFile(null);

      if (onSuccess) {
        onSuccess();
      }

    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Upload failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1f1b3a] p-4 rounded mt-4 text-quiz-main">
      <h3 className="text-quiz-main mb-2">
        Upload Questions via CSV
      </h3>

      <div className="flex justify-between">
        <input type="file" accept=".csv"onChange={handleFileChange} />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="ml-3 bg-green-600 px-3 py-1 text-white rounded"
      >
        {loading ? "Uploading..." : "Upload CSV"}
      </button>
      </div>
    </div>
  );
};

export default CsvQuestionUpload;
