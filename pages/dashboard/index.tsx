/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Dashboard from '../../components/dashboard'
import Logo from '../../components/logo'
import LogoLong from '../../components/logo-long'
import { Link as LinkType, useReorderLinkMutation, useVerifyMutation, useListLinksQuery } from '../../hooks-generated'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'

const DashboardLinks = () => {
    const [links, setLinks] = useState<LinkType[]>()
    const router = useRouter()

    const listLinks = useListLinksQuery({
        fetchPolicy: 'no-cache',
        onCompleted: (data) => {
            if(!data.listLinks) return
            setLinks(data.listLinks as LinkType[])
        }
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

    const reorder = useReorderLinkMutation({
        onCompleted: (data) => {
            console.log(data)
            // Sync data with remote
            if(!data.reorderLink) return
            setLinks(data.reorderLink as LinkType[])
            // Reload IFrame
            if(!document.getElementById('singlelink-preview')) return
            let iframe: HTMLIFrameElement = document.getElementById('singlelink-preview') as HTMLIFrameElement
            iframe.src = iframe.src
        }
    })

    const reorderLinks = async(result: DropResult) => {
        const id=Number.parseInt(result.draggableId ?? '')
        const newIndex = result.destination?.index ?? -1
        const oldIndex = result.source.index
        console.log(`Dragging link ${id} to ${newIndex} from ${oldIndex}`)
        console.log(result)
        if(id && newIndex >=0 && oldIndex >= 0) {
            // Attempt reorder
            console.log('Attempting reorder...')
            reorder[0]({
                variables: {
                    id,
                    newIndex,
                    oldIndex
                }
            })
        }
    }

    useEffect(() => {
        if(!localStorage.getItem('jwt')) {
            router.push('/login')
        }
    },[])

    return (
        <Dashboard>
            <Head>
                <title>Dashboard - Singlelink</title>
            </Head>
            <div className='flex flex-row items-center justify-between w-full mb-8 h1-row'>
                <h1 className='h1'>Links</h1>
                <Link href="/dashboard/link/create" passHref>
                    <button className='flex flex-row items-center justify-center px-4 py-2 bg-indigo-600 text-sm font-semibold text-white rounded-lg hover:bg-indigo-700 cursor-pointer'>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="rgba(255,255,255,1)" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                        Add new
                    </button>
                </Link>
            </div>
            {!reorder[1].loading ?
                <DragDropContext onDragEnd={reorderLinks}>
                    <Droppable droppableId="links">
                        {(provided: any) => (
                        <ul className='links' {...provided.droppableProps} ref={provided.innerRef} style={{width: '100%'}}>
                            {(links ?? []).map((link, i) => (
                                <Draggable draggableId={(link?.id ?? 0).toString()} key={link?.id} index={i}>
                                    {(provided: any) => (
                                        <li {...provided.draggableProps} ref={provided.innerRef} {...provided.dragHandleProps} onClick={() => router.push(`/dashboard/link/${link?.id}`)}>
                                            <div className='w-full mb-4 p-6 bg-white shadow rounded-xl overflow-hidden max-w-4xl' style={{borderLeft: 'solid 12px rgba(0,0,0,.15)'}}>
                                                {link?.label && <div className='text-xl font-medium mb-2'>{link?.label}</div>}
                                                <div className='flex flex-row items-center justify-start space-x-4'>
                                                    <span className='capitalize'>{link?.type}</span>
                                                    <span>|</span>
                                                    <a className='hover:underline hover:text-indigo-600' href={link?.content ?? '#'}>{link?.content?.substring(0, 32) + '...' ?? 'N/A'}</a>
                                                </div>
                                            </div>
                                        </li>
                                    )}
                                </Draggable>
                            ))}
                        </ul>
                        )}
                    </Droppable> 
                </DragDropContext> : <p className='text-gray-700 text-lg'>Loading links...</p>
            }
        </Dashboard>
    )
}

export default DashboardLinks