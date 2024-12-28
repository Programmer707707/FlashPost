const Poster = require('../models/posterModel');

//@route        GET/
//@desc         Get home page
//@access       Public
const getHome = async (req,res) => {
    const posters = await Poster.find().lean();
    res.render('home', {
        title: "Home Page",
        user:req.session.user,
        posters: posters.reverse().slice(0,8),
        isLogged: req.session.isLogged,
        url: process.env.URL,
    });
}

module.exports = getHome;