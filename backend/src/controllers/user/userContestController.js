import { listUserContests,joinContest,} from "../../services/contestService.js";

export const getUserContestsHandler = async (req, res) => {
  try {
    const contests = await listUserContests();
    res.json(contests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const joinContestHandler = async (req, res) => {
  try {
    const result = await joinContest({
      contestId: req.params.id,
      userId: req.user.id,
    });

    switch (result.status) {
      case "NOT_FOUND":
        return res.status(404).json({ message: "Contest not found" });
      case "CONTEST_STARTED":
        return res.status(400).json({ message: "Contest already started" });
      case "ALREADY_JOINED":
        return res.status(400).json({ message: "Already joined contest" });
      case "INSUFFICIENT_BALANCE":
        return res.status(400).json({ message: "Insufficient wallet balance" });
      default:
        return res.json({ message: "Contest joined successfully" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
