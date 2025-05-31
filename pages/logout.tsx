import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Logo from '../components/logo'; // Assuming path is correct

const LogoutPage: NextPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    // When the page loads, and we have session status, trigger sign out
    // and then redirect.
    if (status === 'loading') return; // Wait for session status to be determined

    // If there's a session or even if not (to clear any residual state),
    // attempt signout. The callbackUrl will handle redirection.
    signOut({ redirect: false }).then(() => { // Using redirect:false to handle push manually if needed, or rely on callbackUrl
      router.push('/auth/login?message=You have been logged out.');
    });

  }, [status, router]);

  return (
    <div className='flex flex-col items-center justify-center w-full min-h-screen bg-gray-100 text-gray-800'>
      <Head>
        <title>Logging out - LaunchLinks</title>
        <meta name="description" content="You are being logged out of your LaunchLinks dashboard." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mb-8" style={{width: 60}}>
        <Logo />
      </div>
      <h1 className="text-2xl font-semibold mb-4">Logging out...</h1>
      <p>Please wait while we securely log you out.</p>
    </div>
  );
};

export default LogoutPage;
