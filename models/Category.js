import mongoose, {Schema, model, models} from "mongoose";

const CategorytSchema = new Schema({
    name: {type: String, required: true},
    parent: {type: mongoose.Types.ObjectId, ref:'Category'},
    properties: [{type: Object}]
})

export const Category =  models.Category || model('Category', CategorytSchema)