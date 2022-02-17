import { useRouter } from 'next/router'
import { useState } from 'react'
import Dashboard from '../../components/dashboard'
import { useFetchOverviewQuery, Event as EventType } from '../../hooks-generated'


const Analytics = () => {

    const [weeklyViews, setWeeklyViews] = useState<number>()
    const [weeklyClicks, setWeeklyClicks] = useState<number>()

    const overview = useFetchOverviewQuery({
        onCompleted: (data: { fetchOverview: EventType[] }) => {
            let weekly = {
                views: 0,
                clicks: 0
            }
            data.fetchOverview.map((analytics: EventType) => {
                weekly.views+=analytics.views
                weekly.clicks+=analytics.clicks
            })
            setWeeklyViews(weekly.views)
            setWeeklyClicks(weekly.clicks)
        }
    })

    return (
        <Dashboard>
            <h1 className='h1'>Analytics</h1>
            {overview.data &&
                <div className='w-full grid grid-cols-1 2xl:grid-cols-2 gap-3'>
                    <div className='w-full bg-white rounded-lg shadow p-6 flex flex-col'>
                        <div className='text-gray-600 font-medium'>Today&#39;s views</div>
                        <div className='font-semibold text-3xl mt-2 text-indigo-600'>{overview.data.fetchOverview[overview.data.fetchOverview.length-1].views}</div>
                    </div>
                    {/*<div className='bg-white rounded-lg shadow p-6 flex flex-col'>
                        <div className='text-gray-600 font-medium'>Today&#39;s clicks</div>
                        <div className='font-semibold text-3xl mt-2 text-indigo-600'>{overview.data.fetchOverview[overview.data.fetchOverview.length-1].clicks}</div>
                    </div>*/}
                    <div className='w-full bg-white rounded-lg shadow p-6 flex flex-col'>
                        <div className='text-gray-600 font-medium'>Weekly views</div>
                        <div className='font-semibold text-3xl mt-2 text-indigo-600'>{weeklyViews}</div>
                    </div>
                    {/*<div className='bg-white rounded-lg shadow p-6 flex flex-col'>
                        <div className='text-gray-600 font-medium'>Weekly clicks</div>
                        <div className='font-semibold text-3xl mt-2 text-indigo-600'>{weeklyClicks}</div>
                    </div>*/}
                </div>
            }
        </Dashboard>
    )
}

export default Analytics