import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import Logo from '../../components/logo'; // Assuming logo component path

const LoginPage: NextPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  // Handle query params for error messages or registration success
  useEffect(() => {
    if (router.query.error) {
      setError(router.query.error as string);
    }
    if (router.query.message) {
      // You could display this message more prominently if needed
      console.log(router.query.message);
    }
  }, [router.query]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn('credentials', {
      redirect: false, // We'll handle redirect manually
      email,
      password,
    });

    setLoading(false);

    if (result?.error) {
      setError(result.error);
    } else if (result?.ok) {
      // Successful sign in
      router.push(router.query.callbackUrl as string || '/dashboard');
    }
  };

  if (status === 'loading' || status === 'authenticated') {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className='flex flex-col items-center justify-center w-full min-h-screen bg-gray-100'>
      <Head>
        <title>Login - LaunchLinks</title>
        <meta name="description" content="Login to your LaunchLinks dashboard." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className='flex flex-col items-center justify-center w-full max-w-md p-8 rounded-xl bg-white shadow'>
        <div className='mb-6' style={{width: 44}}><Logo/></div>
        <h1 className='font-semibold text-2xl mb-4'>Login to your LaunchLinks</h1>
        <p className='mb-6 text-gray-600'>Enter your credentials to access your account.</p>

        {error && <p className="text-red-500 text-sm mb-4 bg-red-100 p-3 rounded">{error}</p>}
        {router.query.message && <p className="text-green-500 text-sm mb-4 bg-green-100 p-3 rounded">{router.query.message}</p>}


        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='px-5 py-3 rounded-lg border border-gray-200 w-full bg-white focus:ring-4 focus:ring-opacity-50 focus:ring-indigo-600 outline-0 ring-offset-2 focus:border-gray-100'
              placeholder="you@example.com"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='px-5 py-3 rounded-lg border border-gray-200 w-full bg-white focus:ring-4 focus:ring-opacity-50 focus:ring-indigo-600 outline-0 ring-offset-2 focus:border-gray-100'
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className='px-8 py-4 text-xl bg-indigo-600 w-full text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50'
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
        <p className="mt-6 text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup">
            <a className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign up
            </a>
          </Link>
        </p>
        <div onClick={() => {alert('To reset your password, change the environment variable for PASSWORD in your SSH or terminal and restart your application. This feature will be improved in future versions.')}} className='text-gray-600 mt-8 text-xs cursor-pointer hover:underline'>Forgot your password?</div>
      </div>
      <div className='text-gray-600 mt-4 text-xs'>Copyright ©{new Date().getFullYear()} LaunchLinks Inc. All rights reserved.</div>
    </div>
  );
};

export default LoginPage;
