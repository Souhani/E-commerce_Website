import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default async function handler(req, res) {
    await mongooseConnect();
    const {categories, sort, seacrhField, ...filters} = req.query;
    const [sortField, sortOrder] = (sort || '_id-desc').split('-');
    const productsQuery = {};
    if(seacrhField) {
        productsQuery['$or'] = [
            {title: {$regex:seacrhField, $options:'i'}},
            {description: {$regex:seacrhField, $options:'i'}},
        ]
    };
    if(categories) {
        productsQuery.category = categories.split(',');
    }
    if(Object.keys(filters).length>0) {
         Object.keys(filters).forEach(filterName => {
            productsQuery[`properties.${filterName}`] = filters[filterName];
        })
    };
    res.json(await Product.find(
        productsQuery,
        null,
        {
            sort:{
                [sortField]:sortOrder==='asc'? 1 : -1,
            }
        }))
};

