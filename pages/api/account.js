import { mongooseConnect } from "@/lib/mongoose"
import { Adress } from "@/models/Adress";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
    await mongooseConnect();
    const {user} = await getServerSession(req, res, authOptions);
    if(req.method==='PUT') {
        const address = await Adress.findOne({userEmail: user.email});
        if(address) {
            const addressDoc = await Adress.findByIdAndUpdate(address._id, req.body);
            res.json(addressDoc);
        }else {
            const addressDoc = await Adress.create({
                userEmail: user.email, 
                ...req.body,
            });
            res.json(addressDoc);
        }
    }
    if(req.method==='GET') {
     const addressDoc = await Adress.findOne({userEmail: user.email})
     res.json(addressDoc)
    }
}