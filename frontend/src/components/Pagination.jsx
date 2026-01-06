export default function Pagination({ page, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 pt-3 mt-9">
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="px-3 py-1 rounded bg-[#1b1630] text-quiz-main disabled:opacity-40"
      >
        Prev
      </button>

      <span className="text-xs  text-blue-quiz">
        Page {page} / {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="px-3 py-1 rounded bg-[#1b1630] text-quiz-main disabled:opacity-40 "
      >
        Next
      </button>
    </div>
  );
}
