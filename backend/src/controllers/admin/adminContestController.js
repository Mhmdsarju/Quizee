import {createContestService,getAdminContestsService,editContestService,toggleContestBlockService,endContestService,} from "../../services/contestService.js";
import cloudinary from "../../config/cloudinary.js";

export const createContestHandler = async (req, res) => {
  try {
    let imageUrl =null;

    if(req.file){
      const result=await cloudinary.uploader.upload(req.file.path,{
        folder:"quiz-app/contests",
      });
      imageUrl=result.secure_url;
    }

      const contest = await createContestService({
      ...req.body,
      image: imageUrl,  
    })
    
    res.status(201).json(contest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getAdminContestsHandler = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;
    const result = await getAdminContestsService({
      search,
      page: Number(page),
      limit: Number(limit),
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const editContestHandler = async (req, res) => {
  try {
    const payload = { ...req.body };

    if (req.file) {
      const result = await cloudinary.uploader.upload(
        req.file.path,
        { folder: "quiz-app/contests" }
      );
      payload.image = result.secure_url;
    }

    const result = await editContestService(
      req.params.id,
      payload
    );

    if (result.status === "NOT_FOUND")
      return res.status(404).json({ message: "Contest not found" });

    if (result.status === "EDIT_NOT_ALLOWED")
      return res.status(400).json({ message: "Edit not allowed" });

    res.json({
      message: "Contest updated",
      contest: result.contest,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const toggleBlockContestHandler = async (req, res) => {
  const result = await toggleContestBlockService(req.params.id);

  if (result.status === "NOT_FOUND")
    return res.status(404).json({ message: "Contest not found" });

  if (result.status === "COMPLETED")
    return res.status(400).json({ message: "Completed contest cannot be blocked" });

  res.json({
    message: result.isBlocked ? "Contest blocked" : "Contest unblocked",
    refundedUsers: result.refundedUsers,
    contest: result.contest,
  });
};

export const endContestHandler = async (req, res) => {
  const result = await endContestService(req.params.id);

  if (result.status === "NOT_FOUND")
    return res.status(404).json({ message: "Contest not found" });

  if (result.status === "NOT_LIVE")
    return res.status(400).json({ message: "Contest not live" });

  res.json({
    message: "Contest ended",
    prizePool: result.prizePool,
    totalParticipants: result.totalParticipants,
  });
};
