const Course = require('../models/Course');

// Get all courses
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Add / Map a course to a batch
const createCourseMapping = async (req, res) => {
  try {
    const { title, batchName, category } = req.body;

    if (!title || !batchName || !category) {
      return res.status(400).json({ success: false, error: 'Please provide all required fields' });
    }

    const newCourse = await Course.create({ title, batchName, category });
    res.status(201).json({ success: true, data: newCourse });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete course mapping
const deleteCourseMapping = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Course.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Course mapping not found' });
    }

    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getCourses,
  createCourseMapping,
  deleteCourseMapping,
};