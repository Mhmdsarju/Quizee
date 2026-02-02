import { useContest } from "../hooks/useContest";
import ContestImg from "../assets/ContestImg.jpg"

const ContestCarousel = () => {
  const { data, isLoading } = useContest({
    search: "",
    sort: "latest",
    page: 1,
  });

  if (isLoading)
    return (
      <p className="text-center py-6 text-gray-500">
        Loading contests...
      </p>
    );

  return (
    <div className="px-4">
      <div className="flex gap-4 overflow-x-auto scrollbar-hide py-2">
        {data?.data?.map((contest) => (
          <div
            key={contest._id}
            className="min-w-[260px] max-w-[260px] bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex-shrink-0"
          >
            <div className="h-40 overflow-hidden">
              <img
                src={contest.image||ContestImg}
                alt={contest.title}
                className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="p-4 flex flex-col gap-3">
              <h4 className="text-sm font-semibold text-gray-800 line-clamp-2">
                {contest.title}
              </h4>

              <button className="mt-auto bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 rounded-lg transition">
                Join Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContestCarousel;
