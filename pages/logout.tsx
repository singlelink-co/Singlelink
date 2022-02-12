import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Logo from '../components/logo'
import { useLoginMutation } from '../hooks-generated'

const Home: NextPage = () => {
  const router = useRouter()


  useEffect(() => {
    localStorage.setItem('jwt', '')
    router.push('/login')
  })

  return (
    <div className='flex flex-col items-center justify-center w-full min-h-screen bg-gray-100'>
      <Head>
        <title>Log out</title>
        <meta name="description" content="Log out of your Singlelink dashboard." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  )
}

export default Home
