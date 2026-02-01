import api from "../../../api/axios";
import Swal from "sweetalert2";

export default function ContestCard({ contest, onUpdate, onEdit }) {
  const {_id,title,quiz,entryFee,status,startTime,endTime,isBlocked,} = contest;

  const now = new Date();

  let displayStatus = status;

  if (!isBlocked) {
    if (new Date(endTime) <= now) {
      displayStatus = "COMPLETED";
    } else if (new Date(startTime) <= now) {
      displayStatus = "LIVE";
    } else {
      displayStatus = "UPCOMING";
    }
  } else {
    displayStatus = "BLOCKED";
  }

  const handleBlockToggle = async () => {
    const res = await Swal.fire({
      title: isBlocked ? "Unblock contest?" : "Block contest?",
      text: isBlocked
        ? "Contest will be visible again"
        : "Joined users will be refunded",
      icon: "warning",
      showCancelButton: true,
    });

    if (!res.isConfirmed) return;

    const { data } = await api.patch(`/admin/contest/${_id}/block`);
    onUpdate(data.contest);

    Swal.fire("Success", data.message, "success");
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow">
      <h3 className="font-semibold text-lg">{title}</h3>

      <p className="text-sm text-gray-500">
        Quiz: {quiz?.title || "—"}
      </p>

      <p className="text-sm">Entry Fee: ₹{entryFee}</p>

      <p className="text-xs text-gray-400">
        {new Date(startTime).toLocaleString()} –{" "}
        {new Date(endTime).toLocaleString()}
      </p>

      <span
        className={`inline-block mt-2 px-2 py-1 text-xs rounded
          ${
            displayStatus === "UPCOMING"
              ? "bg-blue-100 text-blue-700"
              : displayStatus === "LIVE"
              ? "bg-green-100 text-green-700"
              : displayStatus === "COMPLETED"
              ? "bg-gray-200 text-gray-700"
              : "bg-red-100 text-red-700"
          }`}
      >
        {displayStatus}
      </span>

      <div className="flex gap-2 mt-4">

        {displayStatus === "UPCOMING" && !isBlocked && (
          <button
            onClick={onEdit}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded"
          >
            Edit
          </button>
        )}
        {displayStatus !== "COMPLETED" && (
          <button
            onClick={handleBlockToggle}
            className={`px-3 py-1 text-sm text-white rounded ${
              isBlocked ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {isBlocked ? "Unblock" : "Block"}
          </button>
        )}
      </div>
    </div>
  );
}
