import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Logo from '../components/logo'
import { useLoginMutation } from '../hooks-generated'

const Home: NextPage = () => {
  const router = useRouter()
  const [password, setPassword] = useState<string>('')

  const login = useLoginMutation({
    fetchPolicy: 'network-only',
    onCompleted: async (data) => {
      if(data?.login) {
        console.log('data')
        console.log(data.login)
        await localStorage.setItem('jwt',data.login)
        return router.push('/dashboard')
      } else {
        console.log('else')
        console.log(data)
      }
    }
  })

  useEffect(() => {
    const jwt = localStorage.getItem('jwt')
    if(jwt) router.push('/dashboard')
  })

  return (
    <div className='flex flex-col items-center justify-center w-full min-h-screen bg-gray-100'>
      <Head>
        <title>Login to Singlelink</title>
        <meta name="description" content="Login to your Singlelink dashboard." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className='flex flex-col items-center justify-center w-full max-w-md p-8 rounded-xl bg-white shadow'>
      <div className='mb-6' style={{width: 44}}><Logo/></div>
        <h1 className='font-semibold text-2xl mb-4'>Login to your Singlelink</h1>
        <p className=' mb-6 text-gray-600'>Enter your credentials to access your account</p>
        <input value={password} onChange={(e) => setPassword(e.target.value)} className='mb-4 px-5 py-3 rounded-lg border border-gray-200 w-full bg-white focus:ring-4 focus:ring-opacity-50 focus:ring-indigo-600 outline-0 ring-offset-2 focus:border-gray-1' type="password" placeholder="Password"/>
        <button onClick={() => login[0]({
          variables: {
            password
          }
        })} className='px-8 py-4 text-xl bg-indigo-600 w-full text-white font-semibold rounded-xl hover:bg-indigo-700'>Log in</button>
      </div>
      <div className='text-gray-600 mt-12'>Forgot your password?<a className='ml-2 text-indigo-600 font-semibold hover:underline hover:text-indigo-700 cursor-pointer'>Reset password</a></div>
      <div className='text-gray-600 mt-4 text-xs'>Copyright ©{new Date().getFullYear()} Neutron Creative Inc. All rights reserved.</div>

    </div>
  )
}

export default Home
