import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import api from "../../api/axios";
import Swal from "sweetalert2";

export default function ContestForm({initialData,onClose,onSuccess,}) {
  const isEdit = !!initialData;
  const [quizzes, setQuizzes] = useState([]);

  const {register,control,handleSubmit,reset,formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      quiz: "",
      entryFee: "",
      startTime: "",
      endTime: "",
      rules: [{ title: "", description: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "rules",
  });

  useEffect(() => {
    api
      .get("/admin/quiz", { params: { limit: 100 } })
      .then(({ data }) => setQuizzes(data.data || []))
      .catch(() => setQuizzes([]));
  }, []);

  useEffect(() => {
    if (!initialData) return;

    reset({
      title: initialData.title || "",
      quiz: initialData.quiz?._id || "",
      entryFee: initialData.entryFee || "",
      startTime: initialData.startTime?.slice(0, 16) || "",
      endTime: initialData.endTime?.slice(0, 16) || "",
      rules:
        initialData.rules?.length > 0
          ? initialData.rules
          : [{ title: "", description: "" }],
    });
  }, [initialData, reset]);

  const onSubmit = async (values) => {
    if (new Date(values.startTime) >= new Date(values.endTime)) {
      return Swal.fire(
        "Invalid Time",
        "End time must be after start time",
        "warning"
      );
    }

    try {
      if (isEdit) {
        const { data } = await api.patch(
          `/admin/contest/${initialData._id}`,
          {
            title: values.title,
            startTime: values.startTime,
            endTime: values.endTime,
            rules: values.rules,
          }
        );

        Swal.fire("Updated", "Contest updated successfully", "success");
        onSuccess(data.contest);
      } else {
        const { data } = await api.post("/admin/contest", {
          ...values,
          entryFee: Number(values.entryFee),
        });

        Swal.fire("Created", "Contest created successfully", "success");
        onSuccess(data);
      }
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
          {...register("title", { required: true })}
          placeholder="Eg: Weekly Coding Contest"
          className="mt-1 w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-600">
          Quiz
        </label>

        {isEdit ? (
          <input
            type="text"
            value={initialData?.quiz?.title || ""}
            disabled
            className="mt-1 w-full border rounded-lg p-2 bg-gray-100 text-gray-600"
          />
        ) : (
          <select
            {...register("quiz", { required: true })}
            className="mt-1 w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none"
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
          {...register("entryFee", { required: true })}
          disabled={isEdit}
          placeholder="Eg: 50"
          className={`mt-1 w-full border rounded-lg p-2 ${
            isEdit ? "bg-gray-100 text-gray-600" : "focus:ring-2 focus:ring-green-500"
          } outline-none`}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-600">
            Start Time
          </label>
          <input
            type="datetime-local"
            {...register("startTime", { required: true })}
            className="mt-1 w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">
            End Time
          </label>
          <input
            type="datetime-local"
            {...register("endTime", { required: true })}
            className="mt-1 w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>
      </div>

      <div>
        <h3 className="font-medium text-gray-700 mb-2">Rules</h3>

        {fields.map((field, i) => (
          <div
            key={field.id}
            className="border rounded-xl p-4 mb-3 bg-gray-50"
          >
            <input
              {...register(`rules.${i}.title`, { required: true })}
              placeholder="Rule title"
              className="w-full border rounded-lg p-2 mb-2 focus:ring-2 focus:ring-green-500 outline-none"
            />

            <textarea
              {...register(`rules.${i}.description`, { required: true })}
              placeholder="Rule description"
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none"
            />

            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(i)}
                className="mt-2 text-sm text-red-600 hover:underline"
              >
                Remove Rule
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() => append({ title: "", description: "" })}
          className="text-sm text-green-600 hover:underline"
        >
          + Add Rule
        </button>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-lg border hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
        >
          {isEdit ? "Update Contest" : "Create Contest"}
        </button>
      </div>
    </form>
  );
}
