const {v4} = require('uuid')
const Poster = require('../models/posterModel');
const User = require('../models/userModel');
//@route        GET/
//@desc         Get posters page
//@access       Public
const getPosters = async (req,res) => {
    try{
        if(req.query.search){
            const searchResults = await Poster.find({title: req.query.search}).lean();
            console.log(searchResults);
        }


        const posters = await Poster.find().lean() // .lean() for security used only in handlebars
        res.render('poster/posters', {
            title: 'Poster Page',
            posters: posters.reverse(),
            user: req.session.user,
            url: process.env.URL,
        });
    }
    catch(err){
        console.log(err);
    }

}

//@route        GET/
//@desc         Get poster by id
//@access       Public
const getOnePoster = async(req,res)=>{
    try{
        const poster = await Poster
        .findByIdAndUpdate(req.params.id, {$inc: {visits: 1}}, {new: true})
        .populate('author')
        .lean();
        res.render('poster/one', {
            title: poster.title,
            url: process.env.URL,
            user: req.session.user,
            author: poster.author,
            poster,
        });
    }
    catch(err){
        console.log(err);
    }

}


//@route        GET/
//@desc         Get adding poster page
//@access       Private
const addNewPosterPage = (req,res)=>{
    res.render('poster/add-poster', {
        title: "Yangi e'lon qo'shish",
        url: process.env.URL,   
        user: req.session.user,

    })
}


//@route        Post/
//@desc         Add new poster
//@access       Private
const addNewPoster = async (req,res) => {
    try{
        const newPoster = new Poster({
            title: req.body.title,
            amount: req.body.amount,
            region: req.body.region,
            description: req.body.description,
            image: 'uploads/' + req.file.filename,
            author: req.session.user._id
        });
        //Here we are adding new poster and connecting it to user
        await User.findByIdAndUpdate(req.session.user._id, {$push: {posters: newPoster._id}}, {new: true, upsert: true});
        const posterSaved = await newPoster.save();
        const posterId = posterSaved._id;
        //We redirect the user to the new added poster page
        res.redirect('/posters/' + posterId);
    }
    catch(err){
        console.log(err);
    }
}


//@route        GET/
//@desc         Edit poster by id
//@access       Public
const getEditPosterPage = async (req,res) =>{
    try{
        poster = await Poster.findById(req.params.id).lean();
        res.render('poster/edit-poster', {
            title: 'Edit Page',
            poster,
            url: process.env.URL,
        })
    }
    catch(err){
        console.log(err);
    }
}


//@route        PATCH/
//@desc         Update poster by id
//@access       Public
const updatePosterById = async (req,res) =>{
   try{
    const editedPost = {
        title: req.body.title,
        amount: req.body.amount,
        image: req.body.image,
        region: req.body.region,
        description: req.body.description,
    }
    await Poster.findByIdAndUpdate(req.params.id, editedPost)
    res.redirect('/posters')
   }
   catch(err){
    console.log(err);
   }
}


//@route        Delete/
//@desc         Delete poster by id
//@access       Public
const DeletePosterPage = async(req,res)=>{
    const id = req.params.id;
    await Poster.findByIdAndDelete(id);
    res.redirect('/posters')
}


module.exports = {getPosters, addNewPosterPage, addNewPoster, getOnePoster, getEditPosterPage, DeletePosterPage, updatePosterById};