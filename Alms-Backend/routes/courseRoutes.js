const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

// Existing collection ya naya model agar courseRoutes mein defined hai
const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    studentName: { type: String, required: true, trim: true },
    batchName: { type: String, required: true, trim: true },
    batchDays: { type: String, required: true, trim: true },
    category: { type: String, default: "Development", trim: true },
    description: { type: String, default: "" },
    price: { type: Number, default: 0 },
    students: { type: Number, default: 1 },
    lessons: { type: Number, default: 0 },
    progress: { type: Number, default: 0 },
    status: { type: String, default: "Published" },
    thumbnail: { type: String, default: "" },
    modules: { type: Array, default: [] },
  },
  { strict: false, timestamps: true }
);

const Course = mongoose.models.Course || mongoose.model("Course", courseSchema, "courses");

// GET /api/courses (with optional ?studentName=...)
router.get("/", async (req, res) => {
  try {
    const { studentName } = req.query;
    const filter = {};
    if (studentName && studentName.trim()) {
      filter.studentName = new RegExp(`^${studentName.trim()}$`, "i");
    }
    const data = await Course.find(filter).sort({ _id: -1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/courses/:id
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, error: "Not found" });
    }
    res.json({ success: true, data: course });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST /api/courses
router.post("/", async (req, res) => {
  try {
    const created = await Course.create(req.body);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PATCH /api/courses/:id
router.patch("/:id", async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, error: "Not found" });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE /api/courses/:id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: "Not found" });
    }
    res.json({ success: true, data: deleted });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;