const express = require("express");
const parser = require("body-parser");
const app = express();

// Importing models
const MentorModel = require("./models/MentorModel.js");
const StudentModel = require("./models/StudentModel.js");

// Configure DOTENV
require("dotenv").config();

// Database configuration
require("./Database/db.js");

// Configure body parser
app.use(parser.json());

const PORT = process.env.PORT;

// To start the server
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server started successfully",
  });
});


// To create Mentor 
app.post('/mentor', async (req, res) => {
  try {
      const mentor = new MentorModel(req.body);
      await mentor.save();
      res.json(mentor);
  } catch (err) {
      res.status(400).json({ message: err.message });
  }
});

// To create  Student 
app.post('/student', async (req, res) => {
  try {
      const student = new StudentModel(req.body);
      await student.save();
      res.json(student);
  } catch (err) {
      res.status(400).json({ message: err.message });
  }
});


// API To Assign a student to mentor 
app.post('/api/assign', async (req, res) => {
  try {
    const { mentorId, studentIds } = req.body;
    await MentorModel.findOneAndUpdate(
      { _id: mentorId },
      { $addToSet: { students: { $each: studentIds } } }
    );
    await StudentModel.updateMany(
      { _id: { $in: studentIds } },
      { $set: { mentor: mentorId } }
    );
    res.json({ success: true, message: "Students assigned to mentor successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Change mentor 
app.put('/api/students/:studentId/assign', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { mentorId } = req.body;
    await StudentModel.findByIdAndUpdate(studentId, { $set: { mentor: mentorId } });
    res.json({ success: true, message: "Mentor assigned to student successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// Show thw students for a mentor
app.get('/api/mentors/:mentorId/students', async (req, res) => {
  try {
    const { mentorId } = req.params;
    const students = await StudentModel.find({ mentor: mentorId });
    res.json({ students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

//  Previously Assigned Mentor for a Student 
app.get('/api/students/:studentId/mentor', async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await StudentModel.findById(studentId).populate('mentor');
    res.json({ mentor: student.mentor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

