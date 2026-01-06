export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="relative w-64">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 pr-9 rounded-md bg-[#1b1630] text-sm text-white outline-none"
      />

      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 -translate-y-1/2
                     text-gray-400 hover:text-white text-sm"
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}
