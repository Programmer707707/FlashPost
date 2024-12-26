const User = require('../models/userModel');
const bcrypt = require('bcrypt');

//@route        GET auth/login
//@desc         Get login page
//@access       Public
const getLoginPage = (req,res) =>{
    res.render('auth/login', {
        title: 'Login',
        url: process.env.URL
    })
}

//@route        GET auth/register
//@desc         Get register page
//@access       Public
const getRegisterPage = (req,res) =>{
    res.render('auth/signup', {
        title: "Ro'yxatdan o'tish",
        url: process.env.URL
    })
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
            return res.redirect('/auth/signup');
        }

        if(password !== password2){
            return res.redirect('/auth/signup');
        }

        // Hashing the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

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
                res.redirect('/auth/login');
            }
        } else {
            res.redirect('/auth/login');
        }
    } catch (err) {
        console.error("Error in loginUser:", err);
    }
};




module.exports = {getLoginPage, getRegisterPage, registerNewUser, loginUser};