const User = require('../models/userModel');
const bcrypt = require('bcrypt');

//@route        GET auth/login
//@desc         Get login page
//@access       Public
const getLoginPage = (req,res) =>{
    if(!req.session.isLogged){
        res.render('auth/login', {
            title: 'Login',
            loginError: req.flash('loginError'),
            url: process.env.URL
        })
    }
}

//@route        GET auth/register
//@desc         Get register page
//@access       Public
const getRegisterPage = (req,res) =>{
   if(!req.session.isLogged){
    res.render('auth/signup', {
        title: "Ro'yxatdan o'tish",
        regError: req.flash('regError'),
        url: process.env.URL
    })
   }
}


//@route        POST auth/register
//@desc         POST register page
//@access       Public
const registerNewUser = async(req,res)=>{
    console.log("Form Data:", req.body); // Check if this logs your data correctly

    try{
        const {email, username, phone, password, password2} = req.body;
        const userExist = await User.findOne({email})

        if(userExist){
            req.flash('regError', "Bunday foydalanuvchi bazada mavjud 🪪");
            return res.redirect('/auth/signup');
        }

        if(password !== password2){
            req.flash('regError', "Parollar bir xil emas 🔑");
            return res.redirect('/auth/signup');
        }

        await User.create({
            email,username, phone, password: hashedPassword
        });

        return res.redirect('/auth/login');
    }
    catch(err){
        console.log(err);
    }
}


//@route        POST auth/login
//@desc         Login register page
//@access       Public
const loginUser = async (req, res) => {
    try {
        console.log("Login Request Body:", req.body);

        const userExist = await User.findOne({ email: req.body.email });
        if (userExist) {
            const matchPassword = await bcrypt.compare(req.body.password, userExist.password);
            console.log(matchPassword);
            if (matchPassword) {
                req.session.user = userExist;
                req.session.isLogged = true;

                req.session.save(err => {
                    if (err) throw err;
                    return res.redirect('/profile/' + req.session.user.username);
                });
            } else {
                req.flash('loginError', "Noto'g'ri ma'lumot kiritildi ❌");
                res.redirect('/auth/login');
            }
        } else {
            req.flash('loginError', "Bunday foydalanuvchi mavjud emas ❌");
            res.redirect('/auth/login');
        }
    } catch (err) {
        console.error("Error in loginUser:", err);
    }
};


//@route        GET auth/logout
//@desc         Logout user
//@access       Private
const logoutUser = (req, res) => {
    req.session.destroy(err => {
        if (err) throw err;
        res.redirect('/');
    });
};



module.exports = {getLoginPage, getRegisterPage, registerNewUser, loginUser, logoutUser};