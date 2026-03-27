import React from 'react'

const page = () => {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1 234-567-8900', status: 'Active', joinDate: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+1 234-567-8901', status: 'Active', joinDate: '2024-01-20' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '+1 234-567-8902', status: 'Inactive', joinDate: '2024-02-10' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', phone: '+1 234-567-8903', status: 'Active', joinDate: '2024-02-15' },
    { id: 5, name: 'Robert Brown', email: 'robert@example.com', phone: '+1 234-567-8904', status: 'Active', joinDate: '2024-03-01' },
    { id: 6, name: 'Emma Davis', email: 'emma@example.com', phone: '+1 234-567-8905', status: 'Inactive', joinDate: '2024-03-05' },
  ];

  return (
    <div className='p-6'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-gray-800 mb-2'>Users</h1>
       
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full border-collapse border border-gray-300'>
          <thead>
            <tr className='bg-black0 text-white'>
              <th className='border border-gray-300 px-4 py-2 text-left'>ID</th>
              <th className='border border-gray-300 px-4 py-2 text-left'>Name</th>
              <th className='border border-gray-300 px-4 py-2 text-left'>Email</th>
              <th className='border border-gray-300 px-4 py-2 text-left'>Phone</th>
              <th className='border border-gray-300 px-4 py-2 text-left'>Status</th>
              <th className='border border-gray-300 px-4 py-2 text-left'>Join Date</th>
              <th className='border border-gray-300 px-4 py-2 text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className='hover:bg-gray-50'>
                <td className='border border-gray-300 px-4 py-2'>{user.id}</td>
                <td className='border border-gray-300 px-4 py-2'>{user.name}</td>
                <td className='border border-gray-300 px-4 py-2'>{user.email}</td>
                <td className='border border-gray-300 px-4 py-2'>{user.phone}</td>
                <td className='border border-gray-300 px-4 py-2'>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    user.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className='border border-gray-300 px-4 py-2'>{user.joinDate}</td>
                <td className='border border-gray-300 px-4 py-2 text-center'>
                  <button className='text-blue-500 hover:underline mr-2'>Edit</button>
                  <button className='text-red-500 hover:underline'>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default page
