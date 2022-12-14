const express  = require("express")
const router =express.Router()
const userController = require("../controller/userController")
const studentController = require("../controller/studentController")
const middleWare = require("../middleware/auth")



//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>API's for User >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.post("/register/user", userController.userRegister)
router.post("/user/login", userController.login)

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>API's for Student >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.post("/students/:userId",middleWare.authentication,studentController.createStudent)
router.get("/get/Student/", middleWare.authentication,studentController.getStudent)
router.put("/update/student/:studentId/:userId", middleWare.authentication, studentController.updateStudent)
router.delete("/delete/student/:studentId/:userId", middleWare.authentication,studentController.delteStudent)

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>For Invalid Routes>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

router.all("/*", function(req,res)
{
   return res.status(404).send(({status:false, error: "/invalid-path params/"}))
})
module.exports = router;