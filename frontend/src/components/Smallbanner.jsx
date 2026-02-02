import { useNavigate } from "react-router-dom"


export default function Smallbanner() {
    const navigate =useNavigate();

   const navQuiz=()=>{
    navigate("user/quiz")
   }
    return (
        <div>
            <div className='bg-blue-quiz  text-white flex justify-center py-5 space-x-5 rounded-lg border border-gray-400 shadow-2xl'>
                <h1 className='text-center py-2 '>Can't decide? Let's play Quiz !!</h1>
                <button onClick={navQuiz} className="bg-[#FFC679] text-black hover:bg-[#cf932f] font-semibold  py-2 px-8 rounded-full shadow-xl transition border border-black ">
                    Start Quiz
                </button>
            </div>
        </div>
    )
}
