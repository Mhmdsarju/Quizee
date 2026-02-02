import { useNavigate } from "react-router-dom";
import QuizImg from "../assets/Quizrm.png";


const HeroBanner = () => {
    const navigate =useNavigate();

   const navQuiz=()=>{
    navigate("user/quiz")
   }
   const navContest=()=>{
    navigate("user/contest")
   }

  return (
  
    <div className="w-full flex justify-center bg-[#f4ecd8] px-4 mb-9 border border-gray-300 shadow-xl rounded-2xl">
     
      <div className="w-full max-w-6xl bg-[#f4ecd8] rounded-2xl px-4-6 py-10 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
        
        <div className="flex-shrink-0 -rotate-6">
          <img
            src={QuizImg}
            alt="Quiz"
            className="w-60 md:w-72"
          />
        </div>

        <div className="text-center md:text-left max-w-xl">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800">
            Don&apos;t just answer questions.
          </h2>

          <h3 className="text-right text-xl md:text-2xl font-extrabold text-purple-400 mt-2">
            Prove you&apos;re job-ready.
          </h3>

          <p className="text-right text-gray-600 mt-4 text-sm md:text-base">
            Not just quizzes—real skill battles.
            <br />
            Test yourself. Rank higher. Win opportunities.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-end md:justify-end">
            <button onClick={navQuiz} className="bg-[#e0a23b] hover:bg-[#cf932f] text-white font-semibold px-8 py-3 rounded-full shadow-xl transition border border-black ">
              QUIZ
            </button>

            <button onClick={navContest} className="bg-[#9b1c13] hover:bg-[#7f1610] text-white font-semibold px-8 py-3 rounded-full shadow-xl transition border border-black">
              CONTEST
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
