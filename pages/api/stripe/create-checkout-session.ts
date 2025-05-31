import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]'; // Adjust path as needed
import stripe from '../../../lib/stripe'; // Your Stripe client
import { findUserByEmail, getDbConnection } from '../../../lib/db'; // Your DB utility to find/update users

// Function to update user with Stripe Customer ID
async function updateUserStripeCustomerId(userId: string, stripeCustomerId: string) {
  const connection = await getDbConnection();
  try {
    await connection.execute(
      'UPDATE `users` SET `stripe_customer_id` = ? WHERE `id` = ?',
      [stripeCustomerId, userId]
    );
  } catch (error) {
    console.error('Error updating user Stripe Customer ID:', error);
    throw error;
  } finally {
    await connection.end();
  }
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const session = await unstable_getServerSession(req, res, authOptions as any);

  if (!session || !session.user?.id || !session.user?.email) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { priceId } = req.body;

  if (!priceId) {
    return res.status(400).json({ error: 'Price ID is required' });
  }

  try {
    const userId = session.user.id;
    const userEmail = session.user.email;

    // Retrieve or create Stripe Customer
    let userRecord = await findUserByEmail(userEmail); // Assuming this fetches the user including stripe_customer_id
    let stripeCustomerId = userRecord?.stripe_customer_id;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: userEmail,
        // You can add more customer details here if needed
        metadata: {
          userId: userId, // Link Stripe customer to your user ID
        },
      });
      stripeCustomerId = customer.id;
      // Store the new stripe_customer_id in your database
      await updateUserStripeCustomerId(userId, stripeCustomerId);
    }

    const successBaseUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard/billing`;
    const cancelBaseUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard/billing`; // Or a pricing page

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer: stripeCustomerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${successBaseUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${cancelBaseUrl}?canceled=true`,
      client_reference_id: userId, // Your internal user ID
    });

    if (!checkoutSession.url) {
        return res.status(500).json({ error: 'Could not create checkout session with Stripe.' });
    }

    // Return the Checkout Session ID to the client
    res.status(200).json({ sessionId: checkoutSession.id, url: checkoutSession.url });

  } catch (error: any) {
    console.error('Stripe Checkout Session Error:', error);
    res.status(500).json({ error: `Stripe error: ${error.message}` });
  }
}
