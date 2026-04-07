"use client";

import React, { useEffect, useState } from 'react'

const getAvatarUrl = (user) => {
  if (!user) return '';
  return user.avatar || user.profileImage || user.image || '';
};

const getInitials = (name) => {
  if (!name) return 'U';
  const parts = String(name).trim().split(/\s+/);
  const first = parts[0]?.[0] || 'U';
  const second = parts[1]?.[0] || '';
  return `${first}${second}`.toUpperCase();
};

const page = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError('');

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/api/users/all`);
        const result = await response.json();

        if (!response.ok || result?.success === false) {
          throw new Error(result?.message || 'Failed to fetch users');
        }

        setUsers(result?.data || []);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError(err.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const getStatusLabel = (user) => {
    if (user?.status) return user.status;
    return user?.verify_Email ? 'Active' : 'Pending';
  };

  const getStatusClass = (status) => {
    const normalized = String(status || '').toLowerCase();
    if (normalized === 'active') {
      return 'bg-green-100 text-green-800';
    }
    if (normalized === 'pending') {
      return 'bg-yellow-100 text-yellow-800';
    }
    return 'bg-red-100 text-red-800';
  };

  const handleDeleteUser = async (userId) => {
    if (!userId) return;

    const confirmed = window.confirm('Are you sure you want to delete this user?');
    if (!confirmed) return;

    try {
      setDeletingId(userId);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/users/${userId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok || result?.success === false) {
        throw new Error(result?.message || 'Failed to delete user');
      }

      setUsers((prev) => prev.filter((user) => (user._id || user.id) !== userId));
    } catch (err) {
      console.error('Failed to delete user:', err);
      setError(err.message || 'Failed to delete user');
    } finally {
      setDeletingId('');
    }
  };

  return (
    <div className='p-6 reveal-up-delay'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-emerald-800 mb-2'>Users</h1>
        <p className='text-slate-600'>Manage all platform users with profile and account status.</p>
      </div>

      {loading && (
        <div className='glass-panel mb-4 rounded-xl p-4 text-slate-600'>
          Loading users...
        </div>
      )}

      {error && (
        <div className='mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700'>
          {error}
        </div>
      )}

      <div className='glass-panel overflow-x-auto rounded-2xl'>
        <table className='w-full border-collapse'>
          <thead>
            <tr className='bg-emerald-50/70 text-emerald-900'>
              <th className='border-b border-emerald-100 px-4 py-3 text-left text-sm font-semibold'>ID</th>
              <th className='border-b border-emerald-100 px-4 py-3 text-left text-sm font-semibold'>Avatar</th>
              <th className='border-b border-emerald-100 px-4 py-3 text-left text-sm font-semibold'>Name</th>
              <th className='border-b border-emerald-100 px-4 py-3 text-left text-sm font-semibold'>Email</th>
              <th className='border-b border-emerald-100 px-4 py-3 text-left text-sm font-semibold'>Phone</th>
              <th className='border-b border-emerald-100 px-4 py-3 text-left text-sm font-semibold'>Role</th>
              <th className='border-b border-emerald-100 px-4 py-3 text-left text-sm font-semibold'>Status</th>
              <th className='border-b border-emerald-100 px-4 py-3 text-left text-sm font-semibold'>Join Date</th>
              <th className='border-b border-emerald-100 px-4 py-3 text-center text-sm font-semibold'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && users.length === 0 && !error && (
              <tr>
                <td className='border-b border-emerald-100 px-4 py-4 text-center text-slate-500' colSpan={9}>
                  No users found.
                </td>
              </tr>
            )}

            {users.map((user, index) => {
              const status = getStatusLabel(user);
              const avatarUrl = getAvatarUrl(user);
              return (
                <tr key={user._id || user.id || index} className='border-b border-emerald-50 hover:bg-emerald-50/35 transition-colors'>
                  <td className='px-4 py-3 text-sm text-slate-700'>{index + 1}</td>
                  <td className='px-4 py-3'>
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={user.name || 'User avatar'}
                        className='h-11 w-11 rounded-full border-2 border-emerald-200 object-cover shadow-sm'
                      />
                    ) : (
                      <div className='h-11 w-11 rounded-full bg-yellow-200 text-amber-800 border-2 border-yellow-300 flex items-center justify-center text-sm font-bold shadow-sm'>
                        {getInitials(user.name)}
                      </div>
                    )}
                  </td>
                  <td className='px-4 py-3 text-sm font-medium text-slate-900'>{user.name || '-'}</td>
                  <td className='px-4 py-3 text-sm text-slate-700'>{user.email || '-'}</td>
                  <td className='px-4 py-3 text-sm text-slate-700'>{user.mobile ?? '-'}</td>
                  <td className='px-4 py-3 text-sm text-slate-700'>
                    <span className='rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700'>
                      {user.role || 'User'}
                    </span>
                  </td>
                  <td className='px-4 py-3 text-sm'>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(status)}`}>
                      {status}
                    </span>
                  </td>
                  <td className='px-4 py-3 text-sm text-slate-700'>
                    {user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : '-'}
                  </td>
                  <td className='px-4 py-3 text-center'>
                    <button
                      type='button'
                      onClick={() => handleDeleteUser(user._id || user.id)}
                      disabled={deletingId === (user._id || user.id)}
                      className='rounded-md px-3 py-1.5 text-red-600 hover:bg-red-50 transition disabled:cursor-not-allowed disabled:opacity-60 text-sm font-semibold'
                    >
                      {deletingId === (user._id || user.id) ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default page
