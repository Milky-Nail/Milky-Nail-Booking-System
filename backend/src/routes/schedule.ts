import { SchedulesHandler } from "../controllers/schedule.controller";
import { Router } from "express";
import multer from "multer";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.mimetype === "application/vnd.ms-excel" ||
      file.mimetype === "text/csv"
    ) {
      cb(null, true);
    } else {
      cb(new Error("僅限上傳 Excel 格式檔案 (.xlsx, .xls, .csv)"));
    }
  },
});

router.get("/", SchedulesHandler.getScheduleList);
router.get("/:staffId", SchedulesHandler.getScheduleListByStaff);
router.post("/upload", upload.single("file"), SchedulesHandler.uploadSchedule);
router.post("/:staffId/:workDate/cancel", SchedulesHandler.cancelSchedule);

export default router;
