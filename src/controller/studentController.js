const studentModel = require('../models/studentModel.js');
const userModel = require('../models/userModel.js');
const Validator = require('../Validator/validation.js');

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>create Student details>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

const createStudent = async function (req, res) {
    try {
        let studentData = req.body;
        let userIdfromToken = req.decodedToken;
        let userIdfromParam = req.params.userId;

        if (!Validator.validId(userIdfromParam)) {
            return res.status(400).send({ status: false, message: "Invalid userId" })
        }
        if (!Validator.isValidRequest(studentData)) {
            return res.status(400).send({ status: false, message: "studentData is required" });
        }
        const { studentName, subjects, marks, userId } = studentData;


        if (!Validator.checkString(studentName)) {
            return res.status(400).send({ status: false, message: "studentName is required" });
        }

        if (!Validator.validateName(studentName)) {
            return res.status(400).send({ status: false, message: "Invalid studentName" });
        }

        if (!Validator.checkString(subjects)) {
            return res.status(400).send({ status: false, message: "subjects is required" });
        }
        if (!Validator.validateName(subjects)) {
            return res.status(400).send({ status: false, message: "Invalid subjects" });
        }
        if (!marks) {
            return res.status(500).send({ status: false, message: "student marks is required" });
        }
        if(!Validator.isValidMarks(marks)){
            return res.status(400).send({status:false, message:"Invalid marks"});
        }

        //-----check user is authorised to update student marks or create new student details.-----//
        if (userIdfromToken != userIdfromParam) {
            return res.status(403).send({ status: false, message: "Unauthorized User" });
        }
        //------if studentName and subject is already present in database then update that student marks-------//
        let updateMarksofStudent = await studentModel.findOneAndUpdate({
            userId: userIdfromParam, studentName: studentName,
            subjects: subjects, isDeleted: false
        },
            { $inc: { marks: marks } },
            { new: true });

        if (!updateMarksofStudent) {
            studentData.userId = userIdfromParam;
            const newStudent = await studentModel.create(studentData);
            return res.status(201).
                send({ status: true, message: "Student detail created successfully", Data: newStudent })

        }
        return res.status(200).
            send({ status: true, message: "Updated student marks successfully", Data: updateMarksofStudent });
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>get Student>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const getStudent = async function (req, res) {
    try {
        let filter = req.query;
        if (!Validator.isValidRequest(filter)) {
            let studentDocument = await studentModel.find({ isDeleted: false })
            if (!studentDocument) {
                return res.status(404).send({ status: false, message: "student document not found" });
            }
            return res.status(200).send({ status: false, message: studentDocument });
        } else {
            let filterCondition = { isDeleted: false };
            const { marksGreaterThan, marksLessThan, marksSort } = filter;

            //---------------------------get student details based on marks--------------------------------//

            if (filter.marksGreaterThan && filter.marksLessThan) {
                filterCondition.marks = { $gt: Number(marksGreaterThan), $lt: Number(marksLessThan) }
            }
            else if (filter.marksGreaterThan) {
                filterCondition.marks = { $gt: Number(marksGreaterThan) }
            } else if (filter.marksLessThan) {
                filterCondition.marks = { $lt: Number(marksLessThan) }
            }
            
            let studentDocument = await studentModel.find({ ...filterCondition }).sort({ marks: marksSort });
            if (!studentDocument) {
                return res.status(404).send({ status: false, message: "Required studentDocument not found" })
            }
            return res.status(200).send({ status: true, message: studentDocument });
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>updateStudentdata>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
const updateStudent = async function (req, res) {
    try {
        let updatedData = req.body;
        let userIdfromParam = req.params.userId;
        let userIdfromToken = req.decodedToken;
        let studentIdfromParam = req.params.studentId;
        if (!Validator.validId(userIdfromParam)) {
            return res.status(400).send({ status: false, message: "Invalid userId" });
        }
        if (!Validator.validId(studentIdfromParam)) {
            return res.status(400).send({ status: false, message: "Invalid studentId" });
        }

        //-----check user is authorised to update student details-----//
        if (userIdfromToken != userIdfromParam) {
            return res.status(403).send({ status: false, message: "Unauthorised User" })
        }

        if (!Validator.isValidRequest(updatedData)) {
            return res.status(400).send({ status: false, message: "studentData is required for updation" })
        }

        //------checking that user is present in database or not-----//
        let checkUserData = await userModel.findById(userIdfromParam)
        if (!checkUserData) return res.status(400).
            send({ status: false, message: `User with userId: ${userIdfromParam} is not present in database.` });

        //------checking that student is present in database or not------//
        let checkStudentData = await studentModel.findOne({ _id: studentIdfromParam, isDeleted: false })
        if (!checkStudentData) return res.status(400).
            send({ status: false, message: `Student with studentId: ${studentIdfromParam} is not present in database.` });

        //---------------------------------------------Update studentData-----------------------------------------------//

        const { studentName, subjects, marks } = updatedData;

        if (studentName) {
            if (!Validator.validateName(studentName)) {
                return res.status(400).send({ status: false, message: "Invalid studentName" });
            }
            checkStudentData.studentName = studentName;
        }

        if (subjects) {
            if (!Validator.validateName(subjects)) {
                return res.status(400).send({ status: false, message: "Invalid subjects" });
            }
            checkStudentData.subjects = subjects;
        }

        if (marks) {
            if(!Validator.isValidMarks(marks)){
                return res.status(400).send({status:false,message:"Invalid marks"});
            }
            checkStudentData.marks = marks;
        }
        //-------save() method replaces the existing document with the passed document---------//

        checkStudentData.save();

        return res.status(200).send({ status: true, message: "studentData updated successfully", Data: checkStudentData });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }

}


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Delete studentDetails>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

const delteStudent = async function (req, res) {
    try {
        let userIdfromParam = req.params.userId;
        let userIdfromToken = req.decodedToken;
        let studentIdfromParam = req.params.studentId;
        if (!Validator.validId(userIdfromParam)) {
            return res.status(400).send({ status: false, message: "Invalid userId" });
        }
        if (!Validator.validId(studentIdfromParam)) {
            return res.status(400).send({ status: false, message: "Invalid studentId" });
        }

        //-----check user is authorised to delete student details-----//
        if (userIdfromToken != userIdfromParam) {
            return res.status(403).send({ status: false, message: "Unauthorised User" })
        }

        let studentData = await studentModel.findOne({ _id: studentIdfromParam, userId: userIdfromParam });
        if (!studentData) return res.status(404).
            send({ status: false, message: `No student not present with this studentId: ${studentId}.` });

        //-------------deleting student details------------------// 
        let deleteStudentdetail = await studentModel.findOneAndUpdate(
            { _id: studentIdfromParam },
            { isDeleted: true, deletedAt: new Date() },
            { new: true }
        );

        return res.status(200).send({ status: true, message: 'Successfully deleted', data: deleteStudentdetail });


    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}
//....................................................................................................................//
module.exports = { createStudent, getStudent, updateStudent, delteStudent }