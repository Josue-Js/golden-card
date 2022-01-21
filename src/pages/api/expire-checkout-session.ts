import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '../../services/stripe';




export default async function expireCheckoutSession (request: NextApiRequest, response: NextApiResponse) {


  if (request.method !== 'POST') {
    return response.status(400).send({ message: 'Only POST requests allowed' })
  }

  const data = request.body;
  const { session_id } = JSON.parse(data);
  const session = await stripe.checkout.sessions.retrieve(session_id);

  if (session.status === "open") {
    await stripe.checkout.sessions.expire(session_id);
  }


  response.status(200).json({ status: 'success' });
}