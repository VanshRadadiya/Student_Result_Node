var express = require('express');
var router = express.Router();
var user = require('../controller/usercontroller');
/* GET home page. */

// ---------------- Admin Side --------------//
router.post('/admin_register', user.admin_register);
router.post('/admin_login', user.admin_login);
router.get('/admin_logout', user.admin_logout);

// -------------- Add/View Division & Standard -------------//
router.post('/add_std_div', user.add_std_div);
router.get('/view_std_div', user.view_std_div);

// -------------- Add/View Staff -------------//
router.post('/add_staff', user.add_staff);
router.get('/view_staff', user.view_staff);

// -------------- Manage Staff -------------//
router.post('/update_staff/:id', user.update_staff);
router.post('/delete_staff/:id', user.delete_staff);

// ---------------- Add/View Student --------------//
router.post('/add_student', user.add_student);
router.get('/view_student', user.view_student);
router.get('/std_div_wise', user.std_div_wise);

// ---------------- Top-3 Result Std & Div Wise --------------//
router.get('/top3_result', user.top3_result);

// ---------------- Staff Side --------------//
router.post('/staff_login', user.staff_login);
router.get('/staff_logout', user.staff_logout);

// ---------------- Staff Student --------------//
router.get('/staff_student', user.staff_student);

// ---------------- Add Student Result --------------//
router.post('/add_result', user.add_result);
router.get('/view_result', user.view_result);

// ---------------- Manage Result --------------//
router.post('/update_result/:id', user.update_result);
router.get('/delete_result/:id', user.delete_result);
router.get('/single_result/:id', user.single_result);

// ---------------- Student Side --------------//
router.post('/student_login', user.student_login);
router.get('/student_logout', user.student_logout);

// ---------------- Student Result --------------//
router.get('/student_result', user.student_result);



module.exports = router;
