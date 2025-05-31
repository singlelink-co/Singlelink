import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import AdminRouteGuard from '../../components/AdminRouteGuard';
import Dashboard from '../../components/dashboard'; // Assuming reuse of dashboard layout
import { useSession } from 'next-auth/react'; // To pass token if needed by API, or just for session check

// Define a type for the user data expected from the API
interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  subscription_plan: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_status: string | null;
  created_at: string; // Assuming it's a string date
}

const AdminUsersPage: NextPage = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession(); // For potential future use if API required token directly

  useEffect(() => {
    const fetchUsers = async () => {
      if (!session) return; // Should be handled by AdminRouteGuard, but good practice

      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/admin/users');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Error: ${response.status}`);
        }
        const data = await response.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (session) { // Only fetch if session exists (and presumably user is admin)
        fetchUsers();
    }
  }, [session]);

  return (
    <Dashboard> {/* Or a simpler admin-specific layout */}
      <Head>
        <title>User Management - Admin Panel</title>
      </Head>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">User Management</h1>

        {loading && <p className="text-gray-600">Loading users...</p>}
        {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">Error fetching users: {error}</p>}

        {!loading && !error && (
          <div className="bg-white shadow-md rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stripe Customer ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sub Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                            {user.role}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.subscription_plan || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.stripe_customer_id || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.stripe_subscription_status || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
             {users.length === 0 && <p className="p-6 text-center text-gray-500">No users found.</p>}
          </div>
        )}
      </div>
    </Dashboard>
  );
};

export default AdminRouteGuard(AdminUsersPage);
