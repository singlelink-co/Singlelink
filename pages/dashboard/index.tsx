/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Dashboard from '../../components/dashboard'
import Logo from '../../components/logo'
import LogoLong from '../../components/logo-long'
import { useVerifyMutation } from '../../hooks-generated'
import { useListLinksQuery } from '../../hooks-generated'

const DashboardLinks = () => {
    const router = useRouter()

    const listLinks = useListLinksQuery({
        fetchPolicy: 'no-cache'
    })

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
        }
    },[])

    return (
        <Dashboard>
            <div className='flex flex-row items-center justify-between w-full mb-8 h1-row'>
                <h1 className='h1'>Links</h1>
                <Link href="/dashboard/link/create" passHref>
                    <button className='flex flex-row items-center justify-center px-4 py-2 bg-indigo-600 text-sm font-semibold text-white rounded-lg hover:bg-indigo-700 cursor-pointer'>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="rgba(255,255,255,1)" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                        Add new
                    </button>
                </Link>
            </div>
            {[...listLinks.data?.listLinks ?? []].sort((a,b) => {
                if ((a?.position ?? 0) > (b?.position ?? 0)) return 1
                if ((a?.position ?? 0) < (b?.position ?? 0)) return -1
                return 0
            }).map((link, i) => (
                <Link key={i} href={`/dashboard/link/${link?.id}`} passHref>
                    <div className='w-full mb-4 p-6 bg-white shadow rounded-xl overflow-hidden cursor-pointer max-w-4xl' style={{borderLeft: 'solid 12px rgba(0,0,0,.15)'}}>
                        {link?.label && <div className='text-xl font-medium mb-2'>{link?.label}</div>}
                        <div className='flex flex-row items-center justify-start space-x-4'>
                            <span className='capitalize'>{link?.type}</span>
                            <span>|</span>
                            <a className='hover:underline hover:text-indigo-600' href={link?.content ?? '#'}>{link?.content?.substring(0, 32) + '...' ?? 'N/A'}</a>
                        </div>
                    </div>
                </Link>
            ))}
        </Dashboard>
    )
}

export default DashboardLinks