import multer from "multer";

const storage = multer.memoryStorage();

export const uploadCSV = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== "text/csv") {
            cb(new Error("Only csv file allowed"));
        }
        cb(null, true);
    }
});