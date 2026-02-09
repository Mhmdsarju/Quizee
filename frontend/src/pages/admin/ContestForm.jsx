import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../../api/axios";
import Swal from "sweetalert2";
import { zodResolver } from "@hookform/resolvers/zod";
import { contestSchema } from "../../schema/contestSchema";

export default function ContestForm({ initialData, onClose, onSuccess, }) {
  const isEdit = !!initialData;

  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting }, } = useForm({
    resolver: zodResolver(contestSchema),
    defaultValues: {
      title: "",
      quiz: "",
      entryFee: 0,
      prizeFirst: 100,
      prizeSecond: 50,
      prizeThird: 25,
      startTime: "",
      endTime: "",
    },
  });

  useEffect(() => {
    api
      .get("/admin/quiz", { params: { limit: 100 } })
      .then(({ data }) => {
        const validQuizzes = (data.data || []).filter(
          (q) => q.questionCount > 0
        );
        setQuizzes(validQuizzes);
      })
      .catch(() => setQuizzes([]));
  }, []);

  useEffect(() => {
    if (!initialData) return;

    reset({
      title: initialData.title || "",
      quiz: initialData.quiz?._id || "",
      entryFee: initialData.entryFee || 0,
      prizeFirst: initialData.prizeConfig?.first ?? 100,
      prizeSecond: initialData.prizeConfig?.second ?? 50,
      prizeThird: initialData.prizeConfig?.third ?? 25,
      startTime: initialData.startTime?.slice(0, 16) || "",
      endTime: initialData.endTime?.slice(0, 16) || "",
    });

    if (initialData.quiz) {
      setSelectedQuiz({
        _id: initialData.quiz._id,
        title: initialData.quiz.title,
        timeLimit: initialData.quiz.timeLimit,
        questionCount: initialData.quiz.questionCount,
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (values) => {
    if (!isEdit && !selectedQuiz) {
      return Swal.fire("Error", "Please select a quiz", "error");
    }

    if (!isEdit) {
      const start = new Date(values.startTime);
      const end = new Date(values.endTime);
      const durationMinutes = (end - start) / (1000 * 60);

      if (durationMinutes < selectedQuiz.timeLimit) {
        return Swal.fire(
          "Invalid Duration",
          `Contest duration must be at least ${selectedQuiz.timeLimit} minutes`,
          "warning"
        );
      }
    }

    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("startTime", values.startTime);
      formData.append("endTime", values.endTime);

      formData.append("prizeFirst", values.prizeFirst);
      formData.append("prizeSecond", values.prizeSecond);
      formData.append("prizeThird", values.prizeThird);

      if (!isEdit) {
        formData.append("quiz", values.quiz);
        formData.append("entryFee", values.entryFee);
      }

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = isEdit
        ? await api.patch(
          `/admin/contest/${initialData._id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        )
        : await api.post(
          "/admin/contest",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

      Swal.fire(
        isEdit ? "Updated" : "Created",
        `Contest ${isEdit ? "updated" : "created"} successfully`,
        "success"
      );

      onSuccess(isEdit ? res.data.contest : res.data);
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Something went wrong",
        "error"
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white w-full max-w-2xl rounded-2xl p-6 shadow-lg max-h-[90vh] overflow-y-auto space-y-5"
    >
      <h2 className="text-xl font-semibold text-gray-800">
        {isEdit ? "Edit Contest" : "Create Contest"}
      </h2>

      <div>
        <label className="text-sm font-medium text-gray-600">
          Contest Title
        </label>
        <input
          {...register("title")}
          className="mt-1 w-full border rounded-lg p-2"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">
            {errors.title.message}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-gray-600">
          Contest Image (optional)
        </label>

        {isEdit && initialData?.image && (
          <img src={initialData.image} alt="contest" className="h-32 rounded-lg mb-2 object-cover" />
        )}

        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="w-full border rounded-lg p-2" />

      </div>

      <div>
        <label className="text-sm font-medium text-gray-600">
          Quiz
        </label>

        {isEdit ? (
          <input
            value={initialData.quiz?.title || ""}
            disabled
            className="mt-1 w-full border rounded-lg p-2 bg-gray-100"
          />
        ) : (
          <select
            {...register("quiz")}
            onChange={(e) => {
              const quiz = quizzes.find(
                (q) => q._id === e.target.value
              );
              setSelectedQuiz(quiz || null);
            }}
            className="mt-1 w-full border rounded-lg p-2"
          >
            <option value="">Select Quiz</option>
            {quizzes.map((q) => (
              <option key={q._id} value={q._id}>
                {q.title}
              </option>
            ))}
          </select>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-gray-600">
          Entry Fee (₹)
        </label>
        <input
          type="number"
          {...register("entryFee", { valueAsNumber: true })}
          disabled={isEdit}
          className="mt-1 w-full border rounded-lg p-2"
        />
        {errors.entryFee && (
          <p className="text-red-500 text-sm">
            {errors.entryFee.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-600">
            Start Time
          </label>
          <input
            type="datetime-local"
            {...register("startTime")}
            className="mt-1 border rounded-lg p-2 w-full"
          />
          {errors.startTime && (
            <p className="text-red-500 text-sm mt-1">
              {errors.startTime.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">
            End Time
          </label>
          <input
            type="datetime-local"
            {...register("endTime")}
            className="mt-1 border rounded-lg p-2 w-full"
          />
          {errors.endTime && (
            <p className="text-red-500 text-sm mt-1">
              {errors.endTime.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-600">
            1st Prize (₹)
          </label>
          <input
            type="number"
            {...register("prizeFirst", { valueAsNumber: true })}
            className="mt-1 w-full border rounded-lg p-2"
          />
          {errors.prizeFirst && (
            <p className="text-red-500 text-sm">
              {errors.prizeFirst.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">
            2nd Prize (₹)
          </label>
          <input
            type="number"
            {...register("prizeSecond", { valueAsNumber: true })}
            className="mt-1 w-full border rounded-lg p-2"
          />
          {errors.prizeSecond && (
            <p className="text-red-500 text-sm">
              {errors.prizeSecond.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">
            3rd Prize (₹)
          </label>
          <input
            type="number"
            {...register("prizeThird", { valueAsNumber: true })}
            className="mt-1 w-full border rounded-lg p-2"
          />
          {errors.prizeThird && (
            <p className="text-red-500 text-sm">
              {errors.prizeThird.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border rounded-lg"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2 bg-green-600 text-white rounded-lg"
        >
          {isEdit ? "Update Contest" : "Create Contest"}
        </button>
      </div>
    </form>
  );
}
