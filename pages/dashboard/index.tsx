/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Logo from '../../components/logo'
import { useVerifyMutation } from '../../hooks-generated'

const Dashboard = () => {
    const router = useRouter()

    const verify = useVerifyMutation({
        onCompleted: (data) => {
            if(data?.verify) {
                localStorage.setItem('jwt', data?.verify)
            } else {
                localStorage.setItem('jwt', '')
                return router.push('/login')
            }
        }
    })

    useEffect(() => {
        if(!localStorage.getItem('jwt')) {
            router.push('/login')
        } else {
            verify[0]({
                variables: {
                    jwt: localStorage.getItem('jwt') ?? ''
                }
            })
        }
    },[])

    return (
      <div className='flex flex-col items-center justify-center w-full min-h-screen bg-gray-100'>
        <Head>
          <title>Logged in</title>
          <meta name="description" content="This Singlelink is under construction!" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className='flex flex-col items-center justify-center w-full max-w-md p-8 rounded-xl text-center'>
        <div className='mb-6' style={{width: 44}}><Logo/></div>
          <h1 className='font-semibold text-2xl mb-4'>Logged in</h1>
          <p className=' mb-6 text-gray-600'>Hurray, you`&apos;`re logged in!</p>
        </div>
      </div>
    )
}

export default Dashboard