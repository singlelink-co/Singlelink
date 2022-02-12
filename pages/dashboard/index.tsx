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

    const listLinks = useListLinksQuery()

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
            <h1 className='text-3xl font-semibold mb-8'>Links</h1>
            {[...listLinks.data?.listLinks ?? []].sort((a,b) => {
                if ((a?.position ?? 0) > (b?.position ?? 0)) return 1
                if ((a?.position ?? 0) < (b?.position ?? 0)) return -1
                return 0
            }).map(link => (
                <div className='w-full mb-4 p-6 bg-white shadow rounded-xl overflow-hidden cursor-grab max-w-4xl' style={{borderLeft: 'solid 12px rgba(0,0,0,.15)'}} key={link?.id}>
                    {link?.label && <div className='text-xl font-medium mb-2'>{link?.label}</div>}
                    <div className='flex flex-row items-center justify-start space-x-4'>
                        <span className='capitalize'>{link?.type}</span>
                        <span>|</span>
                        <a className='hover:underline hover:text-indigo-600' href={link?.content ?? '#'}>{link?.content?.substring(0, 32) + '...' ?? 'N/A'}</a>
                    </div>
                </div>
            ))}
        </Dashboard>
    )
}

export default DashboardLinks