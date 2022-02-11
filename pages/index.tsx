import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Logo from '../components/logo'
import { useListLinksQuery } from '../hooks-generated'

const Home: NextPage = () => {
  const listLinks = useListLinksQuery()
  if(listLinks.loading) return (
    <div className='flex flex-col items-center justify-center w-full min-h-screen text-center bg-gray-100'>
      <p>Loading...</p>
    </div>
  )
  if((listLinks.data?.listLinks ?? []).length<1)
    return (
      <div className='flex flex-col items-center justify-center w-full min-h-screen bg-gray-100'>
        <Head>
          <title>Singlelink under construction</title>
          <meta name="description" content="This Singlelink is under construction!" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className='flex flex-col items-center justify-center w-full max-w-md p-8 rounded-xl text-center'>
        <div className='mb-6' style={{width: 44}}><Logo/></div>
          <h1 className='font-semibold text-2xl mb-4'>Under construction</h1>
          <p className=' mb-6 text-gray-600'>This <a href='https://singlelink.co' target="_blank" className='font-semibold text-indigo-600 hover:underline hover:text-indigo-700' rel="noreferrer">Singlelink</a> page is currently under construction. Be sure to check back soon!</p>
          <Link passHref href="/login">
            <button className='px-8 py-4 w-full bg-indigo-600 w-full text-white font-semibold rounded-xl hover:bg-indigo-700'>Log in to my Singlelink dashboard</button>
          </Link>
        </div>
        <div className='text-gray-600 mt-12 text-xs'>Copyright ©{new Date().getFullYear()} Neutron Creative Inc. All rights reserved.</div>

      </div>
    )
  return (
    <div>
      {listLinks.data?.listLinks?.map(link => (
        <div key={link?.id}>{link?.label}</div>
      ))}
    </div>
  )
}

export default Home
