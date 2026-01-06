export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="relative w-full sm:w-64">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 pr-9 rounded-md bg-[#1b1630] text-sm text-white outline-none placeholder:text-gray-400"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white h-5 w-5 flex items-center justify-center"
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}
