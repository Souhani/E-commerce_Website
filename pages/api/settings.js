import { mongooseConnect } from "@/lib/mongoose";
import { Setting } from "@/models/Setting";

export default async function(req, res) {
    await mongooseConnect();

    if(req.method === 'GET') {
        res.json(await Setting.findOne({name:req.query.name}));
    }
}