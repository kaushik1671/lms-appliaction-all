const User = require('../models/User');
const bcrypt = require('bcryptjs');

// 1. Get Admin List (Jo table mein dikhega)
const getAdminList = async (req, res) => {
  try {
    // Sabhi non-student users ya jinka role admin/instructor/superadmin hai unhe fetch karo
    const admins = await User.find({ role: { $ne: "student" } }).select("-password");
    const formattedAdmins = admins.map(admin => ({
      id: admin._id,
      email: admin.email,
      role: admin.role,
      section: admin.section || "General"
    }));
    res.json({ success: true, admins: formattedAdmins });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Create New Admin / User
const createAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      existingUser.role = "admin";
      await existingUser.save();
      return res.json({ success: true, message: "Existing user promoted to Admin successfully!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new User({
      name: "Staff Member",
      email,
      password: hashedPassword,
      role: "admin",
      section: "admin"
    });

    await newAdmin.save();
    res.json({ success: true, message: "New Admin created successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Assign Role & Section Control
const assignSection = async (req, res) => {
  try {
    const { email, section } = req.body; // Yahan 'section' mein dropdown ki value aa rahi hai (superadmin, admin, instructor, student)
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found with this email" });
    }

    // User ka role aur section dono update kar do
    user.role = section; 
    user.section = section;
    await user.save();

    res.json({ success: true, message: `Role & Access successfully updated to '${section}'!` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAdminList, createAdmin, assignSection };