import { blockContestService, createContest, editContestService, endContestService, listAdminContests } from "../../services/contestService";

export const createContestHandler = async (req, res) => {
  try {
    const contest = await createContest(req.body);
    res.status(201).json(contest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAdminContestsHandler = async (req, res) => {
  try {
    const contests = await listAdminContests();
    res.json(contests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const editContest = async (req, res) => {
  try {
    const result = await editContestService(req.params.id, req.body);

    if (result.status === "NOT_FOUND")
      return res.status(404).json({ message: "Contest not found" });

    if (result.status === "EDIT_NOT_ALLOWED")
      return res.status(400).json({ message: "Edit allowed only before contest starts" });

    res.json({
      message: "Contest updated successfully",
      contest: result.contest,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const blockContest = async (req, res) => {
  try {
    const result = await blockContestService(req.params.id);

    if (result.status === "NOT_FOUND")
      return res.status(404).json({ message: "Contest not found" });

    if (result.status === "ALREADY_COMPLETED")
      return res.status(400).json({ message: "Completed contest cannot be blocked" });

    res.json({
      message: "Contest blocked successfully",
      refundedUsers: result.refundedUsers,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const endContest = async (req, res) => {
  try {
    const result = await endContestService(req.params.id);

    switch (result.status) {
      case "NOT_FOUND":
        return res.status(404).json({ message: "Contest not found" });

      case "NOT_LIVE":
        return res.status(400).json({
          message: "Only LIVE contests can be ended",
        });

      case "NO_PARTICIPANTS":
        return res.json({
          message: "Contest ended. No participants joined",
        });

      default:
        return res.json({
          message: "Contest ended successfully",
          totalParticipants: result.totalParticipants,
          prizePool: result.prizePool,
        });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};