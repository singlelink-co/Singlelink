import type { NextPage } from 'next';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Logo from '../components/logo'; // Adjust path if necessary
import { SUBSCRIPTION_PLANS } from '../lib/constants'; // Assuming constants are here

// Make sure your publishable key is set in environment variables
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

const PricingPage: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null); // To indicate which plan's checkout is loading

  const handleSubscribe = async (priceId: string | undefined, planName: string) => {
    if (!priceId) {
      alert('This plan is not available for subscription at this moment.');
      return;
    }
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/pricing'); // Redirect to login if not authenticated
      return;
    }
    if (!session?.user) {
      alert('You must be logged in to subscribe.');
      return;
    }

    setLoadingPlan(planName);

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to create checkout session.');
      }

      // Option 1: Redirect to Stripe Checkout URL directly if API returns it
      if (data.url) {
         window.location.href = data.url;
      }
      // Option 2: Use redirectToCheckout if API returns only sessionId (more common with stripe-js client-side)
      // else if (data.sessionId) {
      //   const stripe = await stripePromise;
      //   if (stripe) {
      //     const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
      //     if (error) {
      //       console.error('Stripe redirectToCheckout error:', error);
      //       alert(`Error redirecting to checkout: ${error.message}`);
      //     }
      //   } else {
      //      alert('Stripe.js has not loaded yet.');
      //   }
      // }
      else {
        throw new Error('Checkout session details not found.');
      }

    } catch (error: any) {
      console.error('Subscription error:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoadingPlan(null);
    }
  };

  const proPlanPriceId = process.env.NEXT_PUBLIC_STRIPE_PRO_PLAN_PRICE_ID;
  const businessPlanPriceId = process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PLAN_PRICE_ID;

  const userPlan = session?.user?.subscription_plan?.toLowerCase();

  const plans = [
    {
      name: 'Free',
      price: '$0',
      frequency: '/month',
      features: [
        'Standard Links (Vanilla)',
        'Text Blocks',
        'Avatar Link',
        'Basic Analytics',
        'Unlimited Links',
      ],
      priceId: undefined, // No price ID for free plan
      cta: 'Current Plan',
      disabled: userPlan === SUBSCRIPTION_PLANS.FREE || !session, // Example logic
      isCurrent: userPlan === SUBSCRIPTION_PLANS.FREE,
    },
    {
      name: 'Pro',
      price: '$5',
      frequency: '/month',
      features: [
        'All Free plan features',
        'Video Embeds (YouTube)',
        'Image Links',
        'HTML Embeds',
        'Advanced Analytics',
        'Remove LaunchLinks Branding (soon)',
      ],
      priceId: proPlanPriceId,
      cta: userPlan === SUBSCRIPTION_PLANS.PRO ? 'Current Plan' : 'Upgrade to Pro',
      disabled: userPlan === SUBSCRIPTION_PLANS.PRO,
      isCurrent: userPlan === SUBSCRIPTION_PLANS.PRO,
    },
    {
      name: 'Business',
      price: '$15',
      frequency: '/month',
      features: [
        'All Pro plan features',
        'Team Members (coming soon)',
        'Priority Support (coming soon)',
        'Custom Domain (coming soon)',
      ],
      priceId: businessPlanPriceId,
      cta: userPlan === SUBSCRIPTION_PLANS.BUSINESS ? 'Current Plan' : 'Upgrade to Business',
      disabled: userPlan === SUBSCRIPTION_PLANS.BUSINESS,
      isCurrent: userPlan === SUBSCRIPTION_PLANS.BUSINESS,
    },
  ];


  if (status === "loading") {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Pricing Plans - LaunchLinks</title>
        <meta name="description" content="Choose the best LaunchLinks plan for you." />
      </Head>

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block mx-auto" style={{width: 60}}><Logo/></div>
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mt-4">
            Choose Your Plan
          </h1>
          <p className="mt-5 text-xl text-gray-500 max-w-2xl mx-auto">
            Start for free, or unlock powerful features with our Pro and Business plans.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-xl shadow-lg p-8 flex flex-col ${plan.isCurrent ? 'ring-2 ring-indigo-500' : ''}`}
            >
              <h2 className="text-2xl font-semibold text-gray-900">{plan.name}</h2>
              <div className="mt-4">
                <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                <span className="text-base font-medium text-gray-500">{plan.frequency}</span>
              </div>
              <ul className="mt-8 space-y-3 text-sm text-gray-600 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <svg className="flex-shrink-0 h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => plan.priceId && handleSubscribe(plan.priceId, plan.name)}
                disabled={plan.disabled || loadingPlan === plan.name || !plan.priceId}
                className={`mt-10 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium
                  ${plan.isCurrent
                    ? 'bg-gray-200 text-gray-700 cursor-default'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50'}
                  ${loadingPlan === plan.name ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {loadingPlan === plan.name ? 'Processing...' : plan.cta}
              </button>
            </div>
          ))}
        </div>
         <div className='text-center mt-12 text-sm text-gray-500'>
            <p>All prices are in USD. You can cancel or change your plan at any time.</p>
            <p>Need help? <a href="mailto:support@launchlinks.com" className="text-indigo-600 hover:underline">Contact Support</a>.</p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
