const {v4} = require('uuid')
const Poster = require('../models/posterModel');

//@route        GET/
//@desc         Get posters page
//@access       Public
const getPosters = async (req,res) => {
    try{
        const posters = await Poster.find().lean() // .lean() for security used only in handlebars

        res.render('poster/posters', {
            title: 'Poster Page',
            posters: posters.reverse(),
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
        const poster = await Poster.findByIdAndUpdate(req.params.id, {$inc: {visits: 1}}, {new: true}).lean();
        res.render('poster/one', {
            poster,
            url: process.env.URL,
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
    })
}


//@route        Post/
//@desc         Add new poster
//@access       Private
const addNewPoster = async (req,res) => {
    try{
        let poster = {
            title: req.body.title,
            amount: req.body.amount,
            region: req.body.region,
            description: req.body.description,
            image: 'uploads/' + req.file.filename,

        }
        await Poster.create(poster);
    
        res.redirect('/posters');
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