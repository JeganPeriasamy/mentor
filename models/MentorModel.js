const mongoose = require("mongoose");

// Mentor and Student collections in MongoDB, establishing a relationship between them where each student can have a mentor, and each mentor can have multiple students.


// Create Mentor schema
const MentorSchema = new mongoose.Schema({
  name: String,
  students: [{ 
    type: mongoose.Schema.Types.ObjectId,  // each element in the students array is an ObjectId referencing another document.
    ref: 'Student' //  ObjectId references documents in the Student collection.
  }]
});

const MentorModel = mongoose.model('Mentor', MentorSchema);
// Exporting it 
module.exports = MentorModel;

