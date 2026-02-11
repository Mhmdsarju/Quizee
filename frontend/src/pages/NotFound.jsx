import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">

      <h1 className="text-9xl font-extrabold text-indigo-600 tracking-widest">
        404
      </h1>
      
      <div className="bg-indigo-600 px-2 text-sm rounded rotate-12 absolute mb-20">
        Page Not Found
      </div>

      <div className="mt-5 text-center">
        <p className="mt-4 text-gray-500 text-lg">
          The page you're looking for might have been moved or deleted.
        </p>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-all"
        >
          Go Back
        </button>

        <Link
          to="/"
          className="px-6 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;