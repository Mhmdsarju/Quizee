import api from "../../../api/axios";
import Swal from "sweetalert2";
import ContestImg from "../../../assets/ContestImg.jpg";

export default function ContestCard({ contest, onUpdate, onEdit }) {
  const {_id,title,quiz,entryFee,status,startTime,endTime,isBlocked,image,prizeConfig,} = contest;

  const now = new Date();
  let displayStatus = status;

  if (!isBlocked) {
    if (new Date(endTime) <= now) displayStatus = "COMPLETED";
    else if (new Date(startTime) <= now) displayStatus = "LIVE";
    else displayStatus = "UPCOMING";
  } else {
    displayStatus = "BLOCKED";
  }

  const statusStyles = {
    UPCOMING: "bg-blue-100 text-blue-700",
    LIVE: "bg-green-100 text-green-700",
    COMPLETED: "bg-gray-200 text-gray-700",
    BLOCKED: "bg-red-100 text-red-700",
  };

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
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden border">
  
      <div className="relative h-36">
        <img
          src={image || ContestImg}
          alt="contest"
          className="w-full h-full object-cover"
        />

        <span
          className={`absolute top-2 right-2 px-3 py-1 text-xs font-semibold rounded-full ${statusStyles[displayStatus]}`}
        >
          {displayStatus}
        </span>
      </div>

      <div className="p-4 space-y-1">
        <h3 className="font-semibold text-lg line-clamp-1">
          {title}
        </h3>

        <p className="text-sm text-gray-500">
          {quiz?.title || "No Quiz"}
        </p>

        <p className="text-sm font-medium">
          Entry Fee: ₹{entryFee}
        </p>

        {prizeConfig && (
          <div className="mt-1 text-sm">
            <p className="text-xs text-gray-500 font-medium mb-1">
               Prizes :
            </p>
            <div className="flex gap-3">
              <span>🥇 ₹{prizeConfig.first}</span>
              <span>🥈 ₹{prizeConfig.second}</span>
              <span>🥉 ₹{prizeConfig.third}</span>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-400 mt-2">
          {new Date(startTime).toLocaleString()} –{" "}
          {new Date(endTime).toLocaleString()}
        </p>

        <div className="flex gap-2 pt-3">
          {displayStatus === "UPCOMING" && !isBlocked && (
            <button
              onClick={onEdit}
              className="flex-1 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              ✏️ Edit
            </button>
          )}

          {displayStatus !== "COMPLETED" && (
            <button
              onClick={handleBlockToggle}
              className={`flex-1 px-3 py-1.5 text-sm text-white rounded-lg ${
                isBlocked
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {isBlocked ? "✅ Unblock" : "⛔ Block"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
