import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { Setting } from "@/models/Setting";
const stripe = require('stripe')(process.env.STRIPE_SK);

export default async function handler(req,res) {
    if(req.method !== 'POST') {
        res.json("should be a POST reqeust");
        return;
    };
    const {name, email, city, 
           postalCode, streetAddress, 
           country, cartProducts
        } = req.body;
   await mongooseConnect();
    const productsIds = cartProducts;
    const uniqueIds = [...new Set(productsIds)];
    const productsInfos = await Product.find({_id:uniqueIds});

    let line_items = [];
    for(const productId of uniqueIds) {
        const productInfo = productsInfos.find(p => p._id.toString()===productId);
        const quantity = productsIds.filter(id => id===productId)?.length || 0;
        line_items.push(
            {
                quantity,
                price_data:{
                    currency: 'USD',
                    product_data: {name:productInfo.title},
                    unit_amount: Math.floor(productInfo.price*100),
                }
            }
        )
    };
    const session = await getServerSession(req, res, authOptions);
     const orderDoc = await Order.create({
        userEmail: session?.user?.email,
        line_items,
        name,
        email,
        city,
        postalCode,
        streetAddress,
        country,
        paid:false,
     });
     const shippingFeeSetting = await Setting.findOne({name:'shippingFee'});
     const shippingFeeCents = parseFloat(shippingFeeSetting.value || '0') * 100;
     const stripeSession = await stripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        customer_email: email,
        success_url: process.env.PUBLIC_URL + '/cart?success=1',
        cancel_url: process.env.PUBLIC_URL + '/cart?canceled=1',
        metadata: {orderId: orderDoc._id.toString()},
        allow_promotion_codes: true,
        shipping_options: [
            {
                shipping_rate_data: {
                    display_name: 'shipping fee',
                    type: 'fixed_amount',
                    fixed_amount: {amount: shippingFeeCents, currency: "USD"},
                }
            }
        ]
     })
     res.json({
        url: stripeSession.url,
     })
}