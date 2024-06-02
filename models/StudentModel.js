const mongoose = require("mongoose");
// Create Student Schema 
const StudentSchema = new mongoose.Schema({
  name: String,
  mentor: { 
    type: mongoose.Schema.Types.ObjectId, // indicates that the mentor field is an ObjectId referencing another document.
    ref: 'Mentor' 
}
});
const StudentModel = mongoose.model('Student', StudentSchema);
// Exporting it 
module.exports = StudentModel;
