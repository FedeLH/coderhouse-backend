import { Router } from "express";
import { uploader } from "../utils/multer.js";
import { io } from "../config/server.js";

const router = Router();

router.post("/", uploader.array("files"), async (req, res) => {
  try {
    if (!req.files) {
      return res.status(400).json({ status: "error", payload: "No images." });
    }
    const response = { firstFile: req.files[0].filename, files: req.files };
    res.status(201).json({ status: "success", payload: response });
    if (response.product) io.emit("add-new-product", response);
  } catch (error) {
    res.status(404).json({
      status: "error",
      payload: { error: error, message: error.message },
    });
  }
});

export default router;
