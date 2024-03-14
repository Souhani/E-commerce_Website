import { mongooseConnect } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { WishedProduct } from "@/models/WishedProduct";

export default async function handler(req, res) {
   await mongooseConnect();
   const session = await getServerSession(req, res, authOptions);
   if(req.method === 'POST' ){
      if(session?.user){
         const {product} = req.body;
         const wishedProductDoc = await WishedProduct.findOne({
             userEmail: session.user.email,
             product:product,
         });
         if(wishedProductDoc){
            await WishedProduct.findOneAndDelete({
             userEmail: session.user.email,
             product:product,
            })
            res.json('removed')
         }else {
            await WishedProduct.create({
             userEmail: session.user.email,
             product: product
            });
            res.json('created')
         }
      };
      res.json('not loged in')
   };
   if(req.method === 'GET') {
      if(session?.user){
         const wishedProductsDoc = await WishedProduct.find({ userEmail: session.user.email }).populate('product');
         return res.json(wishedProductsDoc)

      };
      res.json('not loged in')
   }
   
}