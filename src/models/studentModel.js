const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const studentSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        ref: "teacher",
        required: true
    },
    studentName: {
        type: String,
        required: true
    },
    subjects: {
        type: String,
        required: true,
        enum: ["Maths", "English", "Hindi", "Science", "Social Science"]
    },
    marks: {
        type: Number,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model("student", studentSchema);