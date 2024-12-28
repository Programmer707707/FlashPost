//@route        GET/
//@desc         Get home page
//@access       Public
const getHome = (req,res) => {
    res.render('home', {
        title: "Home Page",
        user:req.session.user,
        isLogged: req.session.isLogged,
        url: process.env.URL,
    });
}

module.exports = getHome;