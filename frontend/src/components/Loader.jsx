import { LoaderIcon } from "lucide-react";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <LoaderIcon className="w-12 h-12 text-blue-quiz animate-spin" />
    </div>
  );
};

export default Loader;
