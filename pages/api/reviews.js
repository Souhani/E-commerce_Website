import { mongooseConnect } from "@/lib/mongoose";
import { Review } from "@/models/Review";

export default async function handler(req, res) {
    await mongooseConnect();
    if(req.method === 'POST') {
       const {title, description, stars, product} = req.body;
       const reviewDoc = await Review.create({
        product,
        title,
        description,
        stars,
       });
       res.json(reviewDoc);
    };
    if(req.method === 'GET') {
        const {product} = req.query;
        res.json(await Review.find({product}, null, {sort:{createdAt: -1}}));
    }
}