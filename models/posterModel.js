const {Schema, model} = require('mongoose');

const posterSchema = new Schema({
    title: {type: String, required: true},
    amount: {type: Number, required: true},
    image: {type: String, required: true},
    region: {type: String, required: true},
    category: {type: String, required: true, enum: ["transport", "realty", "electronics", "jobs"]},
    description: {type: String, required: true, min:10},
    isActive: {type: Boolean, required: true, default: true},
    visits: {type: Number, default: 1},
    author: {type: Schema.Types.ObjectId, ref: 'User'},
})

//Creating indexes
posterSchema.index({"title": "text", "description": "text"})

posterSchema.statics = {
    searchPartial: function(q){
        return this.find({
            $or: [
                {"title": new RegExp(q, "gi")},
                {"description": new RegExp(q, "gi")},
            ]
        }).exec();
    },

    searchFull: function(q){
        return this.find({
            $text: {$search: q, $caseSensitive: false}
        }).exec();
    }
}

module.exports = model("Poster", posterSchema);