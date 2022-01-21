import { stripe } from '../../services/stripe';
import { NextApiRequest, NextApiResponse } from 'next';





const DOMAIN = process.env.DOMAIN;

export default async function createCheckoutSession(request: NextApiRequest, response: NextApiResponse){


  if (request.method !== 'POST') {
    return response.status(400).send({ message: 'Only POST requests allowed' })

  }

  const data = request.body;
  const { items } = JSON.parse(data)


  const session = await stripe.checkout.sessions.create({
    line_items: items,
    success_url: `${DOMAIN}/checkout?status=success`,
    cancel_url: `${DOMAIN}/checkout?status=canceled`,
    mode: 'payment'
  });


  response.status(200).json({session_id: session.id});
}


