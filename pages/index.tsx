/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next'
import absoluteUrl from 'next-absolute-url'
import Head from 'next/head'
import Link from 'next/link'
import Logo from '../components/logo'
import { Link as LinkType }  from '../hooks-generated'
const parse = require('html-react-parser')

const Home = ({ links }: { links: LinkType[]}) => {
  if(!links)
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
    <>
    <Head>
      <title>{process.env.META_TITLE}</title>
      <meta name="title" content={process.env.META_TITLE} />
      <meta name="description" content={process.env.META_DESC} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://singlelink.co/" />
      <meta property="og:title" content={process.env.META_TITLE} />
      <meta property="og:description" content={process.env.META_DESC} />
      <meta property="og:image" content={process.env.META_IMG} />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://singlelink.co/" />
      <meta property="twitter:title" content={process.env.META_TITLE} />
      <meta property="twitter:description" content={process.env.META_DESC} />
      <meta property="twitter:image" content={process.env.META_IMG} />
    </Head>
    <div className='flex flex-col items-center justify-center w-full max-w-md mx-auto py-16 px-4'>
      {[...links].sort((a,b) => {
        if ((a?.position ?? 0) > (b?.position ?? 0)) return 1
        if ((a?.position ?? 0) < (b?.position ?? 0)) return -1
        return 0
      }).map(link => {
        if(link?.type === 'text')
          return (<div className='text-center flex flex-col items-center justify-center mb-4' key={link?.id}>
            <h1 className="text-3xl mb-4 font-semibold">{link?.label}</h1>
            <h2 className='text-xl text-gray-600'>{link?.content}</h2>
          </div>)
        if(link?.type === 'vanilla')
          return (<a href={link.content ?? '#'} className='shadow hover:scale-105 duration-300 ease-in-out flex flex-col w-full text-center px-3 py-5 mb-3 bg-white text-black text-lg font-medium rounded-lg' key={link?.id}>{link?.label}</a>)
        if(link?.type === 'avatar')
          return (<div className='flex items-center justify-center overflow-hidden w-24 h-24 rounded-full mb-6' key={link?.id}>
            <img alt="User" src={link.content ?? '#'} width='100%' height='auto' />
          </div>)
        if(link?.type === 'youtube')
          return (<div key={link.id} className='embed-container rounded-lg'>
            <iframe src={link.content ?? '#'} frameBorder='0' allowFullScreen></iframe>
          </div>)
        if(link?.type === 'image')
          return (<img key={link.id} src={link.content ?? '#'} alt={link.label ?? ''} style={{width: '100%', height: 'auto'}} />)
        if(link?.type === 'html')
          return (<div key={link.id}>{parse(link.content)}</div>)
      })}
      {process.env.BRANDING && <div className='text-gray-600 mt-auto mt-10 text-center'>Build your free micro-site in seconds with <a href="https://singlelink.co" className='font-medium text-indigo-600 hover:underline hover:text-indigo-700'>Singlelink</a></div>}
    </div>
    </>
  )
}

export async function getServerSideProps({ req }: { req: any}) {
  const { origin } = absoluteUrl(req)
  const res = await fetch(`${origin}/api/graphql`, {
     "headers": {
        "accept": "application/json",
        "content-type": "application/json",
      },
    "body": "{\"operationName\":\"listLinks\",\"variables\":{},\"query\":\"query listLinks {\\n  listLinks {\\n    id\\n    label\\n    content\\n    type\\n    position\\n    __typename\\n  }\\n}\\n\"}",
    "method": "POST"
  })
  const data = await res.json()
  const links: LinkType[] = data.data.listLinks
  return { props: { links } }

}

export default Home
