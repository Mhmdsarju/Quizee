export default function CategoryFilter({
  categories = [],
  selectedCat,
  onSelect,
  onClose, 
}) {
  return (
    <>
      <h3 className="text-sm mb-4 font-bold text-gray-800 uppercase tracking-wider">
        Topics
      </h3>

      <div className="space-y-2">
        <label className="flex items-center gap-3 text-sm cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition">
          <input
            type="radio"
            name="cat"
            checked={selectedCat === ""}
            onChange={() => {
              onSelect("");
              onClose?.();
            }}
            className="w-4 h-4"
          />
          <span>All Categories</span>
        </label>

        {categories.map((c) => (
          <label
            key={c._id}
            className="flex items-center gap-3 text-sm cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <input
              type="radio"
              name="cat"
              checked={selectedCat === c._id}
              onChange={() => {
                onSelect(c._id);
                onClose?.();
              }}
              className="w-4 h-4"
            />
            <span
              className={
                selectedCat === c._id
                  ? "font-bold text-blue-600"
                  : ""
              }
            >
              {c.name}
            </span>
          </label>
        ))}
      </div>
    </>
  );
}
