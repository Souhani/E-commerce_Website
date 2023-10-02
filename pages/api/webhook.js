import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
const stripe = require('stripe')(process.env.STRIPE_SK);
import { buffer } from "micro";

const endpointSecret = "whsec_c31e9cd53a9e70a1aa00ec08483d1d0792dbbd3f3a7baeac5cce8abb1d885560";

export default async function handler(req, res) {
    await mongooseConnect();
    const sig = req.headers['stripe-signature'];

    let event;
  
    try {
      event = stripe.webhooks.constructEvent(await buffer(req), sig, endpointSecret);
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
  
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const data = event.data.object;
        const orderId =data.metadata.orderId;
        const paid = data.payment_status == 'paid';
        if(orderId && paid){
          await Order.findByIdAndUpdate({_id:orderId}, {
            paid:true,
          })
        }
        // Then define and call a function to handle the event payment_intent.succeeded
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    res.status(200).send('ok');
};

export const config = {
    api: {
        bodyParser:false,
    }
};
