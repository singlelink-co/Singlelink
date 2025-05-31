import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import Logo from '../../components/logo'; // Assuming logo component path

const SignupPage: NextPage = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // Optionally, sign in the user directly after successful registration
      // or redirect to login page
      router.push('/auth/login?message=Registration successful. Please log in.');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center w-full min-h-screen bg-gray-100'>
      <Head>
        <title>Sign Up - LaunchLinks</title>
        <meta name="description" content="Create your LaunchLinks account." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className='flex flex-col items-center justify-center w-full max-w-md p-8 rounded-xl bg-white shadow'>
        <div className='mb-6' style={{width: 44}}><Logo/></div>
        <h1 className='font-semibold text-2xl mb-4'>Create your Account</h1>
        <p className='mb-6 text-gray-600'>Join LaunchLinks to start sharing your links.</p>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name (Optional)</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='px-5 py-3 rounded-lg border border-gray-200 w-full bg-white focus:ring-4 focus:ring-opacity-50 focus:ring-indigo-600 outline-0 ring-offset-2 focus:border-gray-100'
            />
          </div>
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
              minLength={6}
              className='px-5 py-3 rounded-lg border border-gray-200 w-full bg-white focus:ring-4 focus:ring-opacity-50 focus:ring-indigo-600 outline-0 ring-offset-2 focus:border-gray-100'
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className='px-8 py-4 text-xl bg-indigo-600 w-full text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50'
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <p className="mt-6 text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/auth/login">
            <a className="font-medium text-indigo-600 hover:text-indigo-500">
              Log in
            </a>
          </Link>
        </p>
      </div>
      <div className='text-gray-600 mt-4 text-xs'>Copyright ©{new Date().getFullYear()} LaunchLinks Inc. All rights reserved.</div>
    </div>
  );
};

export default SignupPage;
