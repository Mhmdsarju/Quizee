export default function AdminList({title,headers,data,renderRow,loading,}) {
  if (loading) {
    return <p className="text-white">Loading...</p>;
  }

  return (
    <div className="text-quiz-main shadow-2xl border-black">
      <h1 className="text-xl font-semibold mb-3 text-blue-quiz">
        {title}
      </h1>

      <div className="bg-blue-quiz/90 rounded-md shadow-md px-4 py-3 space-y-2">

        <div className="hidden md:grid grid-cols-[70px_240px_100px_110px_1fr] items-center text-xs text-gray-400 px-2 pb-2">
          {headers.map((h, i) => (
            <div key={i} className={i === headers.length - 1 ? "text-right" : ""}>
              {h}
            </div>
          ))}
        </div>

        {data.map((item) => (
          <div
            key={item._id}
            className="bg-[#241d3b] rounded-lg px-2 py-2 hover:bg-[#2d2550] transition"
          >
            {renderRow(item)}
          </div>
        ))}
      </div>
    </div>
  );
}
