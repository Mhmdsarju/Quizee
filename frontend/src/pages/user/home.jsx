import ContestCarousel from "../../components/ContestCarousel";
import HeroBanner from "../../components/HeroBanner";
import QuizCarousel from "../../components/QuizCarousel";
import Smallbanner from "../../components/Smallbanner";

const Home = () => {
  return (
    <div className="min-h-screen container m-auto my-14">
      
      <section>
        <HeroBanner/>
      </section>

      <section>
        <h2 className="my-8">Recently Published Contests</h2>
        <ContestCarousel />
      </section>

      <section className="my-8">
        <Smallbanner/>
      </section>

      <section >
        <h2 className="my-8">Recently Published Quizzes</h2>
        <QuizCarousel />
      </section>

    </div>
  );
};

export default Home;
