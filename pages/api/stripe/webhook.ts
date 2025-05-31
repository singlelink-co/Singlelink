import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro'; // To get the raw request body
import stripeClient from '../../../lib/stripe'; // Your initialized Stripe client
import { getDbConnection } from '../../../lib/db'; // Your DB utility

// Disable Next.js body parsing for this route to get the raw body for Stripe signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

async function updateUserSubscription(
    stripeCustomerId: string,
    stripeSubscriptionId: string,
    stripeSubscriptionStatus: string,
    stripeCurrentPeriodEnd: Date,
    planName: string // e.g., 'pro', 'business', 'free'
) {
  const connection = await getDbConnection();
  try {
    // Find user by stripe_customer_id first to get their internal ID
    const [userRows] = await connection.execute('SELECT id FROM `users` WHERE `stripe_customer_id` = ?', [stripeCustomerId]);
    const users = userRows as any[];
    if (!users || users.length === 0) {
      console.error(`Webhook Error: No user found with Stripe Customer ID: ${stripeCustomerId}`);
      return; // Or throw an error to indicate failure, Stripe will retry
    }
    const userId = users[0].id;

    await connection.execute(
      `UPDATE \`users\` SET
        stripe_subscription_id = ?,
        stripe_subscription_status = ?,
        stripe_current_period_end = ?,
        subscription_plan = ?
      WHERE id = ?`,
      [stripeSubscriptionId, stripeSubscriptionStatus, stripeCurrentPeriodEnd, planName, userId]
    );
    console.log(`Updated subscription for user ${userId} (Stripe Customer ${stripeCustomerId}) to plan ${planName}, status ${stripeSubscriptionStatus}`);
  } catch (error) {
    console.error('Error updating user subscription from webhook:', error);
    throw error; // Re-throw to indicate failure, Stripe will retry
  } finally {
    await connection.end();
  }
}

async function updateUserSubscriptionStatus(stripeCustomerId: string, newStatus: string, newPlan?: string) {
  const connection = await getDbConnection();
  try {
    const [userRows] = await connection.execute('SELECT id FROM `users` WHERE `stripe_customer_id` = ?', [stripeCustomerId]);
    const users = userRows as any[];
    if (!users || users.length === 0) {
      console.error(`Webhook Error: No user found with Stripe Customer ID: ${stripeCustomerId} for status update.`);
      return;
    }
    const userId = users[0].id;

    let query = 'UPDATE `users` SET stripe_subscription_status = ?';
    const queryParams: (string | null)[] = [newStatus];

    if (newPlan) {
      query += ', subscription_plan = ?';
      queryParams.push(newPlan);
    }

    query += ' WHERE id = ?';
    queryParams.push(userId);

    await connection.execute(query, queryParams);
    console.log(`Updated subscription status for user ${userId} (Stripe Customer ${stripeCustomerId}) to ${newStatus}` + (newPlan ? ` and plan ${newPlan}` : ''));
  } catch (error) {
    console.error('Error updating user subscription status from webhook:', error);
    throw error;
  } finally {
    await connection.end();
  }
}


// Helper function to map Price ID to your internal plan name
function getPlanNameFromPriceId(priceId: string): string {
  if (priceId === process.env.STRIPE_PRO_PLAN_PRICE_ID) {
    return 'pro';
  } else if (priceId === process.env.STRIPE_BUSINESS_PLAN_PRICE_ID) {
    return 'business';
  }
  // Add more plan mappings if needed
  return 'free'; // Default or throw error if priceId is unknown
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const rawBody = await buffer(req);
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    console.error('Webhook Error: Missing Stripe signature or webhook secret.');
    return res.status(400).send('Webhook Error: Missing Stripe signature or webhook secret.');
  }

  let event: Stripe.Event;

  try {
    event = stripeClient.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('Stripe Webhook Event Received:', event.type, event.id);

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        const stripeCustomerId = session.customer as string;
        const stripeSubscriptionId = session.subscription as string;
        const clientReferenceId = session.client_reference_id; // Your internal user ID

        if (!clientReferenceId) {
            console.error('Webhook Error: client_reference_id missing from checkout.session.completed');
            break; // Important to break, otherwise Stripe might retry indefinitely for this specific error
        }
        if (!stripeSubscriptionId || !stripeCustomerId) {
            console.error('Webhook Error: subscription ID or customer ID missing from checkout.session.completed');
            break;
        }

        // Retrieve the subscription to get current_period_end and price ID
        const subscription = await stripeClient.subscriptions.retrieve(stripeSubscriptionId);
        const planPriceId = subscription.items.data[0]?.price.id;
        const planName = getPlanNameFromPriceId(planPriceId);

        await updateUserSubscription(
          stripeCustomerId,
          stripeSubscriptionId,
          subscription.status, // e.g., 'active'
          new Date(subscription.current_period_end * 1000),
          planName
        );
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.billing_reason === 'subscription_cycle' || invoice.billing_reason === 'subscription_create') {
          const customerId = invoice.customer as string;
          const subscriptionId = invoice.subscription as string;

          if (!subscriptionId || !customerId) {
              console.error('Webhook Error: subscription ID or customer ID missing from invoice.payment_succeeded');
              break;
          }

          const invSubscription = await stripeClient.subscriptions.retrieve(subscriptionId);
          const invPlanPriceId = invSubscription.items.data[0]?.price.id;
          const invPlanName = getPlanNameFromPriceId(invPlanPriceId);

          await updateUserSubscription(
            customerId,
            subscriptionId,
            invSubscription.status,
            new Date(invSubscription.current_period_end * 1000),
            invPlanName
          );
        }
        break;

      case 'customer.subscription.updated':
        const updatedSub = event.data.object as Stripe.Subscription;
        const updatedCustomerId = updatedSub.customer as string;
        const updatedPlanPriceId = updatedSub.items.data[0]?.price.id;
        const updatedPlanName = getPlanNameFromPriceId(updatedPlanPriceId);

        await updateUserSubscription(
            updatedCustomerId,
            updatedSub.id,
            updatedSub.status,
            new Date(updatedSub.current_period_end * 1000),
            updatedPlanName
        );
        break;

      case 'customer.subscription.deleted':
        const deletedSub = event.data.object as Stripe.Subscription;
        const deletedCustomerId = deletedSub.customer as string;
        // When a subscription is deleted, revert user to 'free' plan and update status
        // It's important to handle this correctly, e.g., maybe set status to 'canceled' or 'expired'
        // and then another process handles plan downgrade to 'free' based on current_period_end.
        // For simplicity here, we'll set to 'free' and 'canceled' status.
        await updateUserSubscriptionStatus(deletedCustomerId, 'canceled', 'free');
        break;

      default:
        console.warn(`Unhandled event type ${event.type}`);
    }
    res.status(200).json({ received: true });
  } catch (error: any) {
      console.error(`Webhook handler error for event ${event.type}:`, error);
      res.status(500).json({ error: `Webhook handler error: ${error.message}` });
  }
}
