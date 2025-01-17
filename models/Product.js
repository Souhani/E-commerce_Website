import mongoose, {Schema, model, models} from "mongoose";

const ProductSchema = new Schema({
    title: {type: String, required: true},
    description: String,
    price: {type: Number, required: true},
    images: [String] ,
    category: {type: mongoose.Types.ObjectId},
    properties: {type: Object}
}, {
    timestamps: true,
});

export const Product =  models.Product || model('Product', ProductSchema)