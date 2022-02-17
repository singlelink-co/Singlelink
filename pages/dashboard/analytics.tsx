import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Dashboard from '../../components/dashboard'
import { useFetchOverviewQuery, Event as EventType, FetchOverviewQuery, Overview } from '../../hooks-generated'


const Analytics = () => {
    const [todayViews, setTodayViews] = useState<number>()
    const [todayClicks, setTodayClicks] = useState<number>()
    const [weeklyViews, setWeeklyViews] = useState<number>()
    const [weeklyClicks, setWeeklyClicks] = useState<number>()

    const overview = useFetchOverviewQuery({
        onCompleted: (data: FetchOverviewQuery) => {
            let weekly = {
                views: 0,
                clicks: 0
            }
            if(!data.fetchOverview) throw Error('Fetch Overview not found')
            data.fetchOverview.map((analytics: any) => {
                weekly.views+=analytics.views
                weekly.clicks+=analytics.clicks
            })
            setTodayViews((data.fetchOverview[data.fetchOverview.length - 1] as Overview).views)
            setTodayClicks((data.fetchOverview[data.fetchOverview.length - 1] as Overview).clicks)
            setWeeklyViews(weekly.views)
            setWeeklyClicks(weekly.clicks)
        }
    })

    return (
        <Dashboard>
            <Head>
                <title>Analytics - Singlelink</title>
            </Head>
            <h1 className='h1'>Analytics</h1>
            {overview.data &&
                <>
                <div className='mb-3 w-full bg-white rounded-lg shadow p-6 flex flex-col'>
                    <div className='text-gray-600 font-medium'>Click-through rate (CTR)</div>
                    {weeklyClicks && weeklyViews && <div className='font-semibold text-3xl mt-2 text-indigo-600'>{((weeklyClicks/weeklyViews)*100).toFixed(2)}%</div>}
                </div>
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
                            <div className='text-gray-600 font-medium'>Weekly views</div>
                            <div className='font-semibold text-3xl mt-2 text-indigo-600'>{(weeklyViews ?? 0).toLocaleString("en-US")}</div>
                        </div>
                        <div className='bg-white rounded-lg shadow p-6 flex flex-col'>
                            <div className='text-gray-600 font-medium'>Weekly clicks</div>
                            <div className='font-semibold text-3xl mt-2 text-indigo-600'>{(weeklyClicks ?? 0).toLocaleString("en-US")}</div>
                        </div>
                    </div>
                </>
            }
        </Dashboard>
    )
}

export default Analytics