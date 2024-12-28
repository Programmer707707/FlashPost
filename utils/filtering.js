const Poster = require('../models/posterModel');
const filtering = (category, from, to, region) => {
    let filtering;
    if(category && from && to && region){
        filtering = Poster.find({amount: {$gte: from, $lte: to}, region: region, category: category}).lean();
    }
    else if(category && from && to){
        filtering = Poster.find({amount: {$gte: from, $lte: to}, category: category}).lean();
    }
    else if(category && region){
        filtering = Poster.find({region: region, category: category}).lean();
    }
    else if(from && to){
        filtering = Poster.find({amount: {$gte: from, $lte: to}}).lean();
    }
    else if(region){
        filtering = Poster.find({region: region}).lean();
    }
    else if(category){
        filtering = Poster.find({category: category}).lean();
    }
    else if(from && to && region){
        filtering = Poster.find({amount: {$gte: from, $lte: to}, region: region}).lean();
    }
    else if(category && region && from){
        filtering = Poster.find({amount: {$gte: from}, region: region, category: category}).lean();
    }
    else if(category && region && to){
        filtering = Poster.find({amount: {$lte: to}, region: region, category: category}).lean();
    }
    else if(category && from ){
        filtering = Poster.find({amount: {$gte: from}, category: category}).lean();
    }
    else if(category && to){
        filtering = Poster.find({amount: {$lte: to}, category: category}).lean();
    }
    else if(region && from){
        filtering = Poster.find({amount: {$gte: from}, region: region}).lean();
    }
    else if(region && to){
        filtering = Poster.find({amount: {$lte: to}, region: region}).lean();
    }
    else if(from){
        filtering = Poster.find({amount: {$gte: from}}).lean();
    }
    else if(to){
        filtering = Poster.find({amount: {$lte: to}}).lean();
    }
    else{
        filtering = Poster.find().lean();
    }
    return filtering;
}

module.exports = filtering;