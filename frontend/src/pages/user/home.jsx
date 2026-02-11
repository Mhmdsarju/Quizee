import { useSelector } from "react-redux";
import ContestCarousel from "../../components/ContestCarousel";
import ContestPreviewCarousel from "../../components/ContestPreviewCarousel";
import HeroBanner from "../../components/HeroBanner";
import QuizCarousel from "../../components/QuizCarousel";
import QuizPreviewCarousel from "../../components/QuizPreviewCarousel";
import Smallbanner from "../../components/Smallbanner";

const Home = () => {
   const token=useSelector((state)=>state.auth.accessToken);
  return (
    <div className="min-h-screen container m-auto my-14">
      
      <section>
        <HeroBanner/>
      </section>

      <section>
        <h2 className="my-8">Recently Published Contests</h2>
        {token ? <ContestCarousel /> : <ContestPreviewCarousel />}
      </section>

      <section className="my-8">
        <Smallbanner/>
      </section>

      <section >
        <h2 className="my-8">Recently Published Quizzes</h2>
       {token ? <QuizCarousel /> : <QuizPreviewCarousel />}
      </section>

    </div>
  );
};

export default Home;
