const express = require("express");
const joi=require("joi");
const User=require('../models/User');
const Dweeter=require('../models/Dweeter');
const session=require("express-session");
const UserValidation=joi.object({
    name:joi.string().required().min(3),
    password:joi.string().required().min(8),
    confirm:joi.string().required().valid(joi.ref("password"))
});
const router = express.Router();
router.get('/login',(req, res)=>{
    res.render("login");
})
router.get('/register',(req, res)=>{
    res.render("register");
})
router.post('/register', (req, res)=>{
        const {name, email, password, confirm}=req.body;
        let send_to_user=new Array();
        const validation=UserValidation.validate({name:name, 
            password:password,confirm:confirm}, {abortEarly:false});
        if(validation.error){
            send_to_user.push(validation.error.details[0].message);
        }
        if(send_to_user.length>0){
            console.log(send_to_user);
          res.render('register', {
              send_to_user,
              name,
              email,
              password,
              confirm
          });
        }
        else{
            User.findOne({name:name}).then(found=>{
                if(found){
                    send_to_user.push("UserName is taken")
                    res.render('register', {send_to_user, name, password, confirm});
                }
                else{
                    const addedLogin=new User({
                        name,
                        password
                    });
                    console.log(addedLogin);
                    addedLogin.save().then(user=>{
                        res.redirect('/users/login')
                    }).catch(error=>console.error(error))
                }
            });
        }
});
router.post('/login', (req, res)=>{
    let send_to_user=new Array();
    const {name, password}=req.body;
    User.findOne({name:name}).then((result)=>{
        if(result){
            if(password===result.password){
                res.cookie("legal", true);
                Dweeter.find({}).then((result)=>{
                console.log("Result", result[0]);
                res.cookie("results", result);
                console.log(res.cookies);
                res.cookie("email", name);
                res.redirect("/dweet");
                })
            }
            else{
                send_to_user.push("Invalid Password");
                res.render('login', {send_to_user, password, name});
            }
        }
        else{
            send_to_user.push("Invalid UserName");
            res.render('login', {send_to_user, password, email:name});
        }
    });
});
module.exports = router;