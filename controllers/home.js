//@route        GET/
//@desc         Get home page
//@access       Public
const getHome = (req,res) => {
    res.render('home', {
        title: "Home Page",
        url: process.env.URL,
    });
}

module.exports = getHome;