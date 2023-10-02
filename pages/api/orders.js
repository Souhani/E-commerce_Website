import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
    await mongooseConnect();
    const {user} = await getServerSession(req, res, authOptions);
    const ordersDoc = await Order.find({userEmail: user.email});
    res.json(ordersDoc)
}