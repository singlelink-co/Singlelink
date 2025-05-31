/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next'
import absoluteUrl from 'next-absolute-url'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect } from 'react'
import Logo from '../components/logo'
import { Link as LinkType }  from '../hooks-generated'
const parse = require('html-react-parser')

const Home = ({ links }: { links: LinkType[]}) => {
  if(!links || links.length === 0)
    return (
      <div className='flex flex-col items-center justify-center w-full min-h-screen bg-gray-100'>
        <Head>
          <title>LaunchLinks under construction</title>
          <meta name="description" content="This LaunchLinks is under construction!" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className='flex flex-col items-center justify-center w-full max-w-md p-8 rounded-xl text-center'>
        <div className='mb-6' style={{width: 44}}><Logo/></div>
          <h1 className='font-semibold text-2xl mb-4'>Under construction</h1>
          <p className=' mb-6 text-gray-600'>This <a href='https://launchlinks.com' target="_blank" className='font-semibold text-indigo-600 hover:underline hover:text-indigo-700' rel="noreferrer">LaunchLinks</a> page is currently under construction. Be sure to check back soon!</p>
          <Link passHref href="/login">
            <button className='px-8 py-4 w-full bg-indigo-600 w-full text-white font-semibold rounded-xl hover:bg-indigo-700'>Log in to my LaunchLinks dashboard</button>
          </Link>
        </div>
        <div className='text-gray-600 mt-12 text-xs'>Copyright ©{new Date().getFullYear()} LaunchLinks Inc. All rights reserved.</div>

      </div>
    )
  return (
    <>
    <Head>
      <title>{process.env.META_TITLE}</title>
      <meta name="title" content={process.env.META_TITLE} />
      <meta name="description" content={process.env.META_DESC} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://launchlinks.com/" />
      <meta property="og:title" content={process.env.META_TITLE} />
      <meta property="og:description" content={process.env.META_DESC} />
      <meta property="og:image" content={process.env.META_IMG} />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://launchlinks.com/" />
      <meta property="twitter:title" content={process.env.META_TITLE} />
      <meta property="twitter:description" content={process.env.META_DESC} />
      <meta property="twitter:image" content={process.env.META_IMG} />
    </Head>
    <div className='flex flex-col items-center justify-center w-full max-w-md mx-auto py-16 px-4'>
      {[...links].map(link => {
        if(link?.type === 'text')
          return (<div id={`link-${link.id}`} className='text-center flex flex-col items-center justify-center mb-4' key={link?.id}>
            <h1 className="text-3xl mb-4 font-semibold">{link?.label}</h1>
            <h2 className='text-xl text-gray-600'>{link?.content}</h2>
          </div>)
        if(link?.type === 'vanilla')
          return (<a id={`link-${link.id}`} href={`/api/link/${link?.id}` ?? '#'} className='shadow hover:scale-105 duration-300 ease-in-out flex flex-col w-full text-center px-3 py-5 mb-3 bg-white text-black text-lg font-medium rounded-lg' key={link?.id}>{link?.label}</a>)
        if(link?.type === 'avatar')
          return (<div id={`link-${link.id}`} className='flex items-center justify-center overflow-hidden w-24 h-24 rounded-full mb-6' key={link?.id}>
            <img alt="User" src={link.content ?? '#'} width='100%' height='auto' />
          </div>)
        if(link?.type === 'youtube')
          return (<div id={`link-${link.id}`} key={link.id} className='embed-container rounded-lg'>
            <iframe src={link.content ?? '#'} frameBorder='0' allowFullScreen></iframe>
          </div>)
        if(link?.type === 'image')
          return (<img id={`link-${link.id}`} key={link.id} src={link.content ?? '#'} alt={link.label ?? ''} style={{width: '100%', height: 'auto', marginBottom: 6}} />)
        if(link?.type === 'html')
          return (<div id={`link-${link.id}`} key={link.id}>{parse(link.content)}</div>)
      })}
      {process.env.BRANDING && <div className='text-gray-600 mt-auto mt-10 text-center'>Build your free micro-site in seconds with <a href="https://launchlinks.com" className='font-medium text-indigo-600 hover:underline hover:text-indigo-700'>LaunchLinks</a></div>}
    </div>
    </>
  )
}

import { getFirstUserId } from '../lib/db'; // Import the new function

export async function getServerSideProps({ req }: { req: any}) {
  const { origin } = absoluteUrl(req);
  let links: LinkType[] = [];
  let pageUserId: string | null = null;

  try {
    // Attempt to get a user ID for the public page.
    // This is a placeholder: in a real app, this would come from the URL (e.g., /user/[userId])
    pageUserId = await getFirstUserId();

    if (pageUserId) {
      const res = await fetch(`${origin}/api/graphql`, {
        method: "POST",
        headers: {
          "accept": "application/json", // It's good practice to include accept header
          "content-type": "application/json",
        },
        body: JSON.stringify({
          operationName: "listPublicLinks", // Use the new query
          variables: { userId: pageUserId },
          query: `query listPublicLinks($userId: ID!) {
            listPublicLinks(userId: $userId) {
              id
              label
              content
              type
              position
              __typename
            }
          }`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.data && data.data.listPublicLinks) {
          links = data.data.listPublicLinks;
        } else {
          console.error("GraphQL query for listPublicLinks succeeded but returned no data:", data.errors || data);
        }
      } else {
        console.error("GraphQL request for listPublicLinks failed:", res.status, await res.text());
      }

      // Create 'view' event if not a demo and a pageUserId was determined
      if(req.url?.substr(req.url.length-9) !== 'demo=true') {
        await fetch(`${origin}/api/graphql`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            operationName: "createEvent",
            variables: { type: "view", user_id_on_public_page: pageUserId }, // Pass the pageUserId
            query: `mutation createEvent($type: EVENT_TYPE!, $link_id: Int, $user_id_on_public_page: ID) {
              createEvent(type: $type, link_id: $link_id, user_id_on_public_page: $user_id_on_public_page) {
                id
                type
                created_at
                __typename
              }
            }`,
          }),
        });
      }
    } else {
      console.log("No user ID found to display a public page. The page will show as 'under construction'.");
    }
  } catch (error) {
    console.error("Error in getServerSideProps for public page:", error);
    // links will remain empty, leading to the "under construction" page
  }

  return { props: { links } }; // Pass fetched links (or empty array)
}

export default Home;
