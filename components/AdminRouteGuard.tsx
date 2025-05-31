import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, ComponentType, ReactElement } from 'react';

const AdminRouteGuard = <P extends object>(WrappedComponent: ComponentType<P>): ComponentType<P> => {
  const ComponentWithAdminGuard = (props: P): ReactElement | null => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === 'loading') return; // Do nothing while loading
      if (status === 'unauthenticated') {
        router.replace('/auth/login?callbackUrl=' + encodeURIComponent(router.asPath));
        return;
      }
      if (session && session.user?.role !== 'admin') {
        router.replace('/dashboard'); // Or any other non-admin page e.g. '/'
      }
    }, [session, status, router]);

    // If session is loading, or user is not an admin and redirect is in progress, render nothing or a loading indicator
    if (status === 'loading' || (status === 'authenticated' && session.user?.role !== 'admin')) {
      // You can return a loading spinner here if preferred
      return <div className="flex justify-center items-center min-h-screen">Verifying access...</div>;
    }

    // If user is admin, render the wrapped component
    return session && session.user?.role === 'admin' ? <WrappedComponent {...props} /> : null; // Or a more specific loading/denied component
  };

  // Set a display name for the HOC for better debugging
  ComponentWithAdminGuard.displayName = `AdminRouteGuard(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return ComponentWithAdminGuard;
};

export default AdminRouteGuard;
