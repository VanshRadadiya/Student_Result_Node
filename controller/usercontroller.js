var admin = require('../model/admin_register');
var student = require('../model/add_student');
var staff = require('../model/add_staff');
var result = require('../model/student_result');
var std_div = require('../model/std_div');
const bcrypt = require('bcrypt');
const storage = require('node-persist');
storage.init( /* options ... */);

// --------------- Admin Register -------------//
exports.admin_register = async (req, res) => {
    var count = await admin.find();
    console.log(count);

    if (count.length > 0) {
        res.status(200).json({
            status: "Only One Admin Exist"
        });
    } else {
        var b_pass = await bcrypt.hash(req.body.password, 10);
        req.body.password = b_pass;

        var email = req.body.email;
        var existing = await admin.findOne({ email });

        if (existing) {
            res.status(200).json({
                status: "Admin Already Exist"
            });
        } else {
            var data = await admin.create(req.body);
            res.status(200).json({
                status: "Admin Register Success",
                data
            });
        }
    }
}

var admin_status;
// --------------- Admin Log-in -------------//
exports.admin_login = async (req, res) => {
    admin_status = await storage.getItem('login_admin');

    if (admin_status == undefined) {
        const data = await admin.find({ "email": req.body.email });

        if (data.length == 1) {
            bcrypt.compare(req.body.password, data[0].password, async function (err, result) {
                if (result == true) {
                    await storage.setItem('login_admin', data[0].id);
                    res.status(200).json({
                        status: "Admin Login Success",
                        data
                    })
                } else {
                    res.status(200).json({
                        status: "Wrong Password"
                    })
                }
            });
        } else {
            res.status(200).json({
                status: "Wrong Email"
            })
        }
    } else {
        res.status(200).json({
            status: "Admin Already Login"
        })
    }
}

// -------------- Admin Log-out -------------//
exports.admin_logout = async (req, res) => {
    await storage.removeItem('login_admin');
    res.status(200).json({
        status: "Admin Logout Success"
    })
}

// -------------- Add Division & Standard -------------//
exports.add_std_div = async (req, res) => {
    admin_status = await storage.getItem('login_admin');
    if (admin_status != undefined) {

        var existing = await std_div.findOne({ "std": req.body.std, "div": req.body.div });

        if (existing) {
            res.status(200).json({
                status: "Division & Standard Already Exist"
            })
        } else {
            var data = await std_div.create(req.body);
            res.status(200).json({
                status: "Add Division & Standard Success",
                data
            })
        }
    } else {
        res.status(200).json({
            status: "Admin Not Login"
        })
    }
}

// -------------- View Division & Standard -------------//
exports.view_std_div = async (req, res) => {
    admin_status = await storage.getItem('login_admin');
    if (admin_status != undefined) {
        var data = await std_div.find();
        res.status(200).json({
            status: "View Division & Standard Success",
            data
        })
    } else {
        res.status(200).json({
            status: "Admin Not Login"
        })
    }
}

// -------------- Add Staff -------------//
exports.add_staff = async (req, res) => {
    admin_status = await storage.getItem('login_admin');
    if (admin_status != undefined) {

        var b_pass = await bcrypt.hash(req.body.password, 10);
        req.body.password = b_pass;

        let existing = await staff.findOne({ username: req.body.username });
        let std_div_exist = await std_div.findOne({ "std": req.body.std, "div": req.body.div });

        if (existing) {
            res.status(200).json({
                status: "Username Already Exist"
            })
        } else {
            if (std_div_exist) {
                var data = await staff.create(req.body);
                res.status(200).json({
                    status: "Add Staff Success",
                    data
                })
            } else {
                res.status(200).json({
                    status: "Division & Standard Not Exist"
                })
            }
        }
    }
}

// -------------- View Staff -------------//
exports.view_staff = async (req, res) => {
    admin_status = await storage.getItem('login_admin');
    if (admin_status != undefined) {
        var data = await staff.find();
        res.status(200).json({
            status: "View Staff Success",
            data
        })
    }
}

// -------------- Update Staff -------------//
exports.update_staff = async (req, res) => {
    admin_status = await storage.getItem('login_admin');
    if (admin_status != undefined) {

        // var b_pass = await bcrypt.hash(req.body.password, 10);
        // req.body.password = b_pass;

        var existing = await staff.findOne({ "username": req.body.username });
        let std_div_exist = await std_div.findOne({ "std": req.body.std, "div": req.body.div });

        // if (existing) {
        //     res.status(200).json({
        //         status: "Username Already Exist"
        //     })
        // }else{
        if (std_div_exist) {
            var data = await staff.findByIdAndUpdate(req.params.id, { std: req.body.std, div: req.body.div }, { new: true });
            res.status(200).json({
                status: "Update Staff Success",
                data
            })
        } else {
            res.status(200).json({
                status: "Division & Standard Not Exist"
            })
        }
        // }
    }
}

// -------------- Delete Staff -------------//
exports.delete_staff = async (req, res) => {
    admin_status = await storage.getItem('login_admin');
    if (admin_status != undefined) {
        var data = await staff.findByIdAndDelete(req.params.id);
        res.status(200).json({
            status: "Delete Staff Success",
            data
        })
    }
}

// -------------- Add Student -------------//
exports.add_student = async (req, res) => {
    admin_status = await storage.getItem('login_admin');
    if (admin_status != undefined) {
        var b_pass = await bcrypt.hash(req.body.password, 10);
        req.body.password = b_pass;

        var existing = await student.findOne({ "username": req.body.username });
        var std_div_exist = await std_div.findOne({ "std": req.body.std, "div": req.body.div });

        if (existing) {
            res.status(200).json({
                status: "Username Already Exist"
            })
        } else {

            if (std_div_exist) {
                var data = await student.create(req.body);
                res.status(200).json({
                    status: "Student Add Success",
                    data
                })
            } else {
                res.status(200).json({
                    status: "Division & Standard Not Exist"
                })
            }
        }
    } else {
        res.status(200).json({
            status: "Admin Not Login"
        })
    }
}

// -------------- View Student -------------//
exports.view_student = async (req, res) => {
    admin_status = await storage.getItem('login_admin');
    if (admin_status != undefined) {
        var data = await student.find();
        res.status(200).json({
            status: "View Student Success",
            data
        })
    } else {
        res.status(200).json({
            status: "Admin Not Login"
        })
    }
}

// -------------- View Student Std & Wise-------------//
exports.std_div_wise = async (req, res) => {
    admin_status = await storage.getItem('login_admin');
    if (admin_status != undefined) {
        const { std, div } = req.query;

        let query = {};
        if (std && div) {
            query = { std, div };
        }
        var std_div_exist = await std_div.findOne({ "std": req.query.std, "div": req.query.div });

        if (std_div_exist) {
            var data = await student.find(query);
            if (data.length > 0) {
                res.status(200).json({
                    status: "View Student Success",
                    data
                });
            } else {
                res.status(200).json({
                    status: "Student Not Found"
                });
            }
        } else {
            res.status(200).json({
                status: "Division & Standard Not Exist"
            });
        }
    } else {
        res.status(200).json({
            status: "Admin Not Login"
        });
    }
}

// -------------- View Top-3 Result Std & Wise-------------//
exports.top3_result = async (req, res) => {
    admin_status = await storage.getItem('login_admin');
    if (admin_status != undefined) {
        const { std, div } = req.query;

        var std_div_exist = await std_div.findOne({ 'std' : req.query.std, 'div' : req.query.div });

        if (std_div_exist) {
            const data = await student.find({'std': req.query.std, 'div': req.query.div}).limit(3);
            const top_data = await result.find({'stu_id.std': data.std, 'stu_id.div': data.div}).sort({percentage:-1}).limit(3).populate('stu_id');
            res.status(200).json({
                status: "View Top-3 Result Success",
                top_data
            })
        }else{
            res.status(200).json({
                status: "Division & Standard Not Exist"
            })
        }
        
    } else {
        res.status(200).json({
            status: "Admin Not Login"
        })
    }
}


var staff_status;
// -------------- Staff Log-in-------------//
exports.staff_login = async (req, res) => {
    staff_status = await storage.getItem('login_staff');

    if (staff_status == undefined) {
        const data = await staff.find({ "username": req.body.username });

        if (data.length == 1) {
            bcrypt.compare(req.body.password, data[0].password, async function (err, result) {
                if (result == true) {
                    await storage.setItem('login_staff', data[0].id);
                    res.status(200).json({
                        status: "Staff Login Success",
                        data
                    })
                } else {
                    res.status(200).json({
                        status: "Wrong Password"
                    })
                }
            });
        } else {
            res.status(200).json({
                status: "Wrong Email"
            })
        }
    } else {
        res.status(200).json({
            status: "Staff Already Login"
        })
    }
}

// -------------- Staff Log-out-------------//
exports.staff_logout = async (req, res) => {
    await storage.removeItem('login_staff');
    res.status(200).json({
        status: "Staff Logout Success"
    })
}

// -------------- Staff Student-------------//
exports.staff_student = async (req, res) => {
    staff_status = await storage.getItem('login_staff');
    if (staff_status != undefined) {
        var staff_data = await staff.findById(staff_status);
        var student_data = await student.find({ "std": staff_data.std, "div": staff_data.div });
        if (student_data.length > 0) {
            res.status(200).json({
                status: "Staff Student Success",
                student_data
            })
        } else {
            res.status(200).json({
                status: "Student Not Found"
            })
        }
    } else {
        res.status(200).json({
            status: "Staff Not Login"
        })
    }
}


// -------------- Add Student Result-------------//
exports.add_result = async (req, res) => {

    staff_status = await storage.getItem('login_staff');
    if (staff_status != undefined) {
        var stu_id = req.body.stu_id;
        var stu_data = await student.findById(stu_id);
        var staff_data = await staff.findById(staff_status);
        if (stu_data.div == staff_data.div && stu_data.std == staff_data.std) {
            var total = parseFloat(req.body.sub1) + parseFloat(req.body.sub2) + parseFloat(req.body.sub3) + parseFloat(req.body.sub4) + parseFloat(req.body.sub5);
            var min = Math.min(req.body.sub1, req.body.sub2, req.body.sub3, req.body.sub4, req.body.sub5);
            var max = Math.max(req.body.sub1, req.body.sub2, req.body.sub3, req.body.sub4, req.body.sub5);
            if (req.body.sub1 > 35 && req.body.sub2 > 35 && req.body.sub3 > 35 && req.body.sub4 > 35 && req.body.sub5 > 35) {
                var percentage = parseFloat((total / 500) * 100);
            }
            else {
                var percentage = "0";
            }
            var grade;
            if (req.body.sub1 > 35 && req.body.sub2 > 35 && req.body.sub3 > 35 && req.body.sub4 > 35 && req.body.sub5 > 35) {
                if (percentage >= 90) {
                    grade = "A+"
                }
                else if (percentage >= 80) {
                    grade = "A"
                }
                else if (percentage >= 70) {
                    grade = "B"
                }
                else if (percentage >= 60) {
                    grade = "C"
                }
                else if (percentage >= 50) {
                    grade = "D"
                }
                else {
                    grade = "F"
                }
            }
            else {
                grade = "***"
            }

            var temp = 0;
            if (req.body.sub1 > 35) {
                temp = temp + 1;
            }

            if (req.body.sub2 > 35) {
                temp = temp + 1;
            }

            if (req.body.sub3 > 35) {
                temp = temp + 1;
            }

            if (req.body.sub4 > 35) {
                temp = temp + 1;
            }

            if (req.body.sub5 > 35) {
                temp = temp + 1;
            }

            var status;
            if (temp == 5) {
                status = "Pass";
            } else if (temp == 4 || temp == 3) {
                status = "ATKT";
            } else {
                status = "Fail";
            }

            req.body.total = total;
            req.body.min = min;
            req.body.max = max;
            req.body.percentage = percentage;
            req.body.grade = grade;
            req.body.status = status;

            var data = await result.create(req.body);
            res.status(200).json({
                status: "Add Result Success",
                data
            })
        }else{
            res.status(200).json({
                status: "Not Allowed Add Student Result that is not in your class"
            })
        }
    } else {
        res.status(200).json({
            status: "Staff Not Login"
        })
    }
}

// -------------- View Student Result-------------//
exports.view_result = async (req, res) => {
   staff_status = await storage.getItem('login_staff');
   if (staff_status != undefined) {
       var staff_data = await staff.find({"id":staff_status});
       console.log(staff_data);
       var data = await result.find({"stu_id.std": staff_data.std, "stu_id.div": staff_data.div }).populate('stu_id');
       res.status(200).json({
           status: "View Result Success",
           data
       })
   }else{
       res.status(200).json({
           status: "Staff Not Login"
       })
   }
}

// -------------- View Single Student Result-------------//
exports.single_result = async (req, res) => {
    staff_status = await storage.getItem('login_staff');
    if (staff_status != undefined) {
        var staff_data = await student.find({"id":staff_status});
        var data = await result.find({ 'stu_id': req.params.id });

        if(staff_data.div == data[0].stu_id.div && staff_data.std == data[0].stu_id.std){
            var data = await result.find({ 'stu_id': req.params.id }).populate('stu_id');
            res.status(200).json({
                status: "View Single Result Success",
                data
            })
        } else{
            res.status(200).json({
                status: "Not Allowed View Single Result that is not in your class"
            })
        }   
    } else {
        res.status(200).json({
            status: "Admin Not Login"
        })
    }
}

// -------------- Update Result-------------//
exports.update_result = async (req, res) => {
    staff_status = await storage.getItem('login_staff');
    if (staff_status != undefined) {
        var staff_data = await staff.find({'id':staff_status});
        var res_data = await result.findById(req.params.id);

        if(staff_data.std == res_data.stu_id.std && staff_data.div == res_data.stu_id.div){
            var total = parseFloat(req.body.sub1) + parseFloat(req.body.sub2) + parseFloat(req.body.sub3) + parseFloat(req.body.sub4) + parseFloat(req.body.sub5);
            var min = Math.min(req.body.sub1, req.body.sub2, req.body.sub3, req.body.sub4, req.body.sub5);
            var max = Math.max(req.body.sub1, req.body.sub2, req.body.sub3, req.body.sub4, req.body.sub5);
            if (req.body.sub1 > 35 && req.body.sub2 > 35 && req.body.sub3 > 35 && req.body.sub4 > 35 && req.body.sub5 > 35) {
                var percentage = parseFloat((total / 500) * 100);
            }
            else {
                var percentage = "0";
            }
            var grade;
            if (req.body.sub1 > 35 && req.body.sub2 > 35 && req.body.sub3 > 35 && req.body.sub4 > 35 && req.body.sub5 > 35) {
                if (percentage >= 90) {
                    grade = "A+"
                }
                else if (percentage >= 80) {
                    grade = "A"
                }
                else if (percentage >= 70) {
                    grade = "B"
                }
                else if (percentage >= 60) {
                    grade = "C"
                }
                else if (percentage >= 50) {
                    grade = "D"
                }
                else {
                    grade = "F"
                }
            }
            else {
                grade = "***"
            }

            var temp = 0;
            if (req.body.sub1 > 35) {
                temp = temp + 1;
            }

            if (req.body.sub2 > 35) {
                temp = temp + 1;
            }

            if (req.body.sub3 > 35) {
                temp = temp + 1;
            }

            if (req.body.sub4 > 35) {
                temp = temp + 1;
            }

            if (req.body.sub5 > 35) {
                temp = temp + 1;
            }

            var status;
            if (temp == 5) {
                status = "Pass";
            } else if (temp == 4 || temp == 3) {
                status = "ATKT";
            } else {
                status = "Fail";
            }

            req.body.total = total;
            req.body.min = min;
            req.body.max = max;
            req.body.percentage = percentage;
            req.body.grade = grade;
            req.body.status = status;

            var data = await result.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.status(200).json({
                status: "Add Result Success",
                data
            })
        }else{
            res.status(200).json({
                status: "Not Allowed Update Result that is not in your class"
            })
        }
    } else {
        res.status(200).json({
            status: "Staff Not Login"
        })
    }
    
}

// -------------- Delete Result-------------//
exports.delete_result = async (req, res) => {
    staff_status = await storage.getItem('login_staff');

    if (staff_status != undefined) {
        var staff_data = await staff.find({'id':staff_status});
        var res_data = await result.findById(req.params.id);
        if (staff_data.std == res_data.stu_id.std && staff_data.div == res_data.stu_id.div) {
            var data = await result.findByIdAndDelete(req.params.id);
            res.status(200).json({
                status: "Delete Result Success",
                data
            })
        }else{
            res.status(200).json({
                status: "Not Allowed Delete Result that is not in your class"
            })
        }
    } else {
        res.status(200).json({
            status: "Admin Not Login"
        })
    }
}

var student_status;
// ------------------ Student Login ---------------//
exports.student_login = async (req, res) => {
    student_status = await storage.getItem('login_student');

    if (student_status == undefined) {
        const data = await student.find({ "username": req.body.username });

        if (data.length == 1) {
            bcrypt.compare(req.body.password, data[0].password, async function (err, result) {
                if (result == true) {
                    await storage.setItem('login_student', data[0].id);
                    res.status(200).json({
                        status: "Student Login Success",
                        data
                    })
                } else {
                    res.status(200).json({
                        status: "Wrong Password"
                    })
                }
            });
        } else {
            res.status(200).json({
                status: "Wrong Username"
            })
        }
    } else {
        res.status(200).json({
            status: "Student Already Login"
        })
    }
}

// ------------------ Student Logout ---------------//
exports.student_logout = async (req, res) => {
    await storage.removeItem('login_student');
    res.status(200).json({
        status: "Student Logout Success"
    })
}

// ------------------ Student Result ---------------//
exports.student_result = async (req, res) => {
    student_status = await storage.getItem('login_student');
    if (student_status!= undefined) {
        var data = await result.find({ 'stu_id': student_status }).populate('stu_id');
        res.status(200).json
        ({
            status: "View Result Success",
            data
        })
    } else {
        res.status(200).json
        ({
            status: "Student Not Login"
        })
    }
}
