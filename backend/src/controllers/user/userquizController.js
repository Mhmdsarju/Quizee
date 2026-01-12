import { getUserQuizService } from "../../services/quizService.js";

export const getUserQuizzes = async (req, res) => {
  try {
    const { search, category, page, sort } = req.query;
    const result = await getUserQuizService({search,category,page,sort,limit: 9,});
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



