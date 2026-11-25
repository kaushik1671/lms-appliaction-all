// models/Course.js
import mongoose from "mongoose";

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

export default mongoose.model("Course", courseSchema, "courses");