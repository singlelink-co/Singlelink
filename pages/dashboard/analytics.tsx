import Head from 'next/head';
import Link from 'next/link'; // Import Link for upgrade message
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Dashboard from '../../components/dashboard';
import { useFetchOverviewQuery, Event as EventType, FetchOverviewQuery, Overview } from '../../hooks-generated';
import { hasPremiumAccess } from '../../lib/constants'; // Import helper

const Analytics = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [todayViews, setTodayViews] = useState<number>(0);
    const [todayClicks, setTodayClicks] = useState<number>(0);
    const [weeklyViews, setWeeklyViews] = useState<number>(0);
    const [weeklyClicks, setWeeklyClicks] = useState<number>(0);

    const userSubscriptionPlan = session?.user?.subscription_plan;
    const canAccessDetailedAnalytics = hasPremiumAccess(userSubscriptionPlan);

    // Effect to handle redirection if not authenticated
    useEffect(() => {
        if (status === 'loading') return;
        if (!session) router.push('/auth/login');
    }, [session, status, router]);

    const { loading: overviewLoading, error: overviewError, data: overviewData } = useFetchOverviewQuery({
        skip: !session, // Skip query if no session or if user doesn't have premium access (optional, could fetch basic for all)
        onCompleted: (data: FetchOverviewQuery) => {
            let weekly = { views: 0, clicks: 0 };
            if(!data.fetchOverview) { // Changed from throw Error to console.error for graceful handling
                console.error('Fetch Overview data is not available');
                return;
            }
            data.fetchOverview.forEach((analytics: any) => { // Changed from map to forEach
                weekly.views += analytics.views;
                weekly.clicks += analytics.clicks;
            });
            if(data.fetchOverview.length > 0) {
                setTodayViews((data.fetchOverview[data.fetchOverview.length - 1] as Overview).views);
                setTodayClicks((data.fetchOverview[data.fetchOverview.length - 1] as Overview).clicks);
            }
            setWeeklyViews(weekly.views);
            setWeeklyClicks(weekly.clicks);
        }
    });

    if (status === 'loading' || !session) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    return (
        <Dashboard>
            <Head>
                <title>Analytics - LaunchLinks</title>
            </Head>
            <h1 className='h1'>Analytics</h1>

            {!canAccessDetailedAnalytics && (
                <div className="mb-6 p-4 bg-yellow-100 text-yellow-700 rounded-lg shadow">
                    <p className="font-semibold">Upgrade for More Detailed Analytics!</p>
                    <p>Your current plan provides basic analytics. Upgrade to Pro or Business for more in-depth insights, historical data, and advanced filtering.</p>
                    <Link href="/pricing">
                        <a className="mt-2 inline-block text-indigo-600 font-semibold hover:text-indigo-700 underline">
                            View Pricing Plans
                        </a>
                    </Link>
                </div>
            )}

            {overviewLoading ? (
                 <div className='p-3 text-gray-600'>Loading analytics, please wait...</div>
            ) : overviewError ? (
                 <div className='p-3 text-red-600'>Error loading analytics: {overviewError.message}</div>
            ) : overviewData && overviewData.fetchOverview ? (
                <>
                {/* Always show CTR, but it might be 0 if no data */}
                <div className='mb-3 w-full bg-white rounded-lg shadow p-6 flex flex-col'>
                    <div className='text-gray-600 font-medium'>Click-through rate (CTR) - Last 7 days</div>
                    <div className='font-semibold text-3xl mt-2 text-indigo-600'>{weeklyViews > 0 ? `${((weeklyClicks/weeklyViews)*100).toFixed(2)} %` : '0%'}</div>
                </div>

                {/* Show detailed stats only if premium access */}
                {canAccessDetailedAnalytics ? (
                    <>
                        <div className='w-full grid grid-cols-1 2xl:grid-cols-2 gap-3 mb-3'>
                            <div className='w-full bg-white rounded-lg shadow p-6 flex flex-col'>
                                <div className='text-gray-600 font-medium'>Today&#39;s views</div>
                                <div className='font-semibold text-3xl mt-2 text-indigo-600'>{(todayViews ?? 0).toLocaleString("en-US")}</div>
                            </div>
                            <div className='bg-white rounded-lg shadow p-6 flex flex-col'>
                                <div className='text-gray-600 font-medium'>Today&#39;s clicks</div>
                                <div className='font-semibold text-3xl mt-2 text-indigo-600'>{(todayClicks ?? 0).toLocaleString("en-US")}</div>
                            </div>
                        </div>
                        <div className='w-full grid grid-cols-1 2xl:grid-cols-2 gap-3'>
                                <div className='w-full bg-white rounded-lg shadow p-6 flex flex-col'>
                                    <div className='text-gray-600 font-medium'>Weekly views (Last 7 days)</div>
                                    <div className='font-semibold text-3xl mt-2 text-indigo-600'>{(weeklyViews ?? 0).toLocaleString("en-US")}</div>
                                </div>
                                <div className='bg-white rounded-lg shadow p-6 flex flex-col'>
                                    <div className='text-gray-600 font-medium'>Weekly clicks (Last 7 days)</div>
                                    <div className='font-semibold text-3xl mt-2 text-indigo-600'>{(weeklyClicks ?? 0).toLocaleString("en-US")}</div>
                                </div>
                            </div>
                    </>
                ) : (
                    <div className='p-3 text-gray-600 text-center'>
                        Basic click-through rate is shown. For daily and weekly trend data, please upgrade your plan.
                    </div>
                )}
                </>
            ) : (
                 <div className='p-3 text-gray-600'>No analytics data available.</div>
            )}
        </Dashboard>
    );
};

export default Analytics;