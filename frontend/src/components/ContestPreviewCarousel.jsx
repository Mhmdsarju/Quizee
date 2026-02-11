import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ContestImg from "../assets/ContestImg.jpg";

const DUMMY_CONTESTS = Array.from({ length: 9 });

const ContestPreviewCarousel = () => {
  const navigate = useNavigate();

  return (
    <div className="px-4 relative">
      <div className="flex gap-4 overflow-x-auto py-2 blur-sm pointer-events-none">
        {DUMMY_CONTESTS.map((_, index) => (
          <div
            key={index}
            className="min-w-[260px] max-w-[260px] bg-white rounded-2xl shadow-md overflow-hidden flex-shrink-0 border border-black"
          >
            <div className="h-40 overflow-hidden relative border border-black">
              <img
                src={ContestImg}
                alt="Contest Preview"
                className="h-full w-full object-cover"
              />

              <span className="absolute top-2 right-2 text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-700">
                LOCKED
              </span>
            </div>

            <div className="p-4 flex flex-col gap-2">
              <h4 className="text-sm font-semibold text-gray-800">
                Contest Name
              </h4>
              <p className="text-xs text-gray-500">Entry Fee: ₹---</p>

              <button className="mt-auto bg-green-600 text-white text-sm py-2 rounded-lg">
                Login to Play
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Lock size={34} className="mb-2" />
        <p className="text-sm mb-3">Login to unlock contests</p>
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-blue-quiz text-quiz-admin rounded-lg"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default ContestPreviewCarousel;
