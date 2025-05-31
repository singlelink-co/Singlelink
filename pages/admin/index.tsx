import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import AdminRouteGuard from '../../components/AdminRouteGuard';
import Dashboard from '../../components/dashboard'; // Assuming you might want to reuse the dashboard layout shell

const AdminIndexPage: NextPage = () => {
  return (
    <Dashboard> {/* Or a simpler admin-specific layout */}
      <Head>
        <title>Admin Panel - LaunchLinks</title>
      </Head>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Panel</h1>

        <nav>
          <ul className="space-y-4">
            <li>
              <Link href="/admin/users">
                <a className="text-indigo-600 hover:text-indigo-800 text-lg p-3 bg-indigo-50 hover:bg-indigo-100 rounded-md block transition duration-150 ease-in-out">
                  User Management
                </a>
              </Link>
            </li>
            {/* Add more admin sections here as needed */}
            {/* Example:
            <li>
              <Link href="/admin/settings">
                <a className="text-indigo-600 hover:text-indigo-800 text-lg p-3 bg-indigo-50 hover:bg-indigo-100 rounded-md block transition duration-150 ease-in-out">
                  Site Settings
                </a>
              </Link>
            </li>
            */}
          </ul>
        </nav>

        <div className="mt-12 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Welcome, Admin!</h2>
            <p className="text-gray-600">
                This is the central hub for managing LaunchLinks. Use the navigation links to manage users, view site statistics, or configure settings.
            </p>
            <p className="mt-4 text-sm text-gray-500">
                Remember to use these tools responsibly.
            </p>
        </div>

      </div>
    </Dashboard>
  );
};

export default AdminRouteGuard(AdminIndexPage);
