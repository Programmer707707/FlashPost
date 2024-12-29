const {v4} = require('uuid')
const Poster = require('../models/posterModel');
const User = require('../models/userModel');
const filtering = require('../utils/filtering');

//@route        GET/
//@desc         Get posters page
//@access       Public
const getPosters = async (req,res) => {
    try{
        const pageLimit = 10;
        const limit = Number(req.query.limit);
        const page = Number(req.query.page);
        const total = await Poster.countDocuments();
      
        //Redirect if queries [page,limit] don't exist
        if(req.url == '/'){
            return res.redirect(`?page=1&limit=${pageLimit}`);
        }


        if(req.query.search){
            const {search} = req.query;
            const posters = await Poster.searchPartial(search); 

            return res.status(200).render('poster/searchResults', {
                title: 'Search Results',
                posters: posters.map(poster => poster.toObject()).reverse(),
                user: req.session.user,
                querySearch: req.query.search,
                url: process.env.URL,
            })
        }

        if(Object.keys(req.query).length > 0 && (req.query.category || req.query.from || req.query.to || req.query.region)){
            const {category, from, to, region} = req.query;
            const filterings = filtering(category, from, to, region);
            const posters = await Poster.find(filterings).lean();
            return res.render('poster/searchResults', {
                title: 'Filter Results',
                posters: posters.reverse(),
                querySearch: req.query.search,
                user: req.session.user,
                url: process.env.URL,
            })
        }

        const posters = await Poster
        .find()
        .skip((page-1)*limit)
        .limit(limit)
        .lean() 
        return res.render('poster/posters', {
            title: 'Poster Page',
            pagination: {
                page,
                limit,
                pageCount: Math.ceil(total/pageLimit),
            },
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
            category: req.body.category,
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
        category: req.body.category,
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