const User = require('../models/userModel');
const bcrypt = require('bcrypt');

//@route        GET /profile/:username
//@desc         Users' profile page
//@access       Private
const getProfilePage = async(req,res)=>{
    try{
        const userProfile = await User
        .findOne({username: req.params.username})
        .populate('posters')
        .lean();
        if(!userProfile){
            throw new Error("Bunday foydalanuvchi mavjud emas ❌");
        }
        
        let isMe = false;
        if(req.session.user){
            isMe = userProfile._id == req.session.user._id.toString();
        }
        console.log(req.session.user);
        res.render('user/profile', {
            title: `${userProfile.username}`,
            user: req.session.user,
            userProfile,
            isMe,
            posters: userProfile.posters,
            isAuth: req.session.isLogged,
            url: process.env.URL
        })
    }
    catch(err){
        console.log(err);
    }
}


//@route        GET /profile/change
//@desc         Update user details page
//@access       Private
const updateUserPage = async (req,res)=>{
    const user = await User.findById(req.session.user._id).lean();
    try{
        res.render('user/update', {
            title: `${req.session.user.username}`,
            user,
            changeError: req.flash('changeError'),
            isAuth: req.session.isLogged,
            url: process.env.URL
        })
    }
    catch(err){
        console.log(err);
    }
}


//@route        POST /profile/change
//@desc         Update user details 
//@access       Private
const updateUser = async (req,res)=>{
    try{
        const {username, phone, oldPassword, newPassword} = req.body
        if(oldPassword==='' && newPassword===''){
            await User.findByIdAndUpdate(req.session.user._id, {username, phone});
            return res.redirect('/profile/' + username);
        }

        const user = await User.findById(req.session.user._id);
        const matchPassword = await bcrypt.compare(oldPassword, user.password);

        if(!matchPassword){
            req.flash('changeError', "Oldingi parol noto'g'ri ❌");
            return res.redirect('/profile/change');
        }
       
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await User.findByIdAndUpdate(req.session.user._id, {username, phone, password: hashedPassword});
        return res.redirect('/profile/' + username);
    }
    catch(err){
        console.log(err);
    }
}


module.exports = {getProfilePage, updateUserPage, updateUser};