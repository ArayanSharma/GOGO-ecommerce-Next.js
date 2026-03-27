import React from 'react'

const page = () => {
  const products = [
    { id: 1, product: 'Taj Mahal', category: 'Gorcery', price: '$999', sales: 45, stock: 12 },
     { id: 2, product: 'Taj Mahal', category: 'Gorcery', price: '$999', sales: 45, stock: 12 },
      { id: 3, product: 'Taj Mahal', category: 'Gorcery', price: '$999', sales: 45, stock: 12 },
       { id: 4, product: 'Taj Mahal', category: 'Gorcery', price: '$999', sales: 45, stock: 12 },
        { id: 5, product: 'Taj Mahal', category: 'Gorcery', price: '$999', sales: 45, stock: 12 },
    
  ];

  return (
    <div className='p-6'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-gray-800 mb-2'>Products</h1>
        <button className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition'>
          Add Product
        </button>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full border-collapse border border-gray-300'>
          <thead>
            <tr className='bg-black0 text-white'>
              <th className='border border-gray-300 px-4 py-2 text-left'>ID</th>
              <th className='border border-gray-300 px-4 py-2 text-left'>Product</th>
              <th className='border border-gray-300 px-4 py-2 text-left'>Category</th>
              <th className='border border-gray-300 px-4 py-2 text-left'>Price</th>
              <th className='border border-gray-300 px-4 py-2 text-left'>Sales</th>
              <th className='border border-gray-300 px-4 py-2 text-left'>Stock</th>
              <th className='border border-gray-300 px-4 py-2 text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className='hover:bg-gray-50'>
                <td className='border border-gray-300 px-4 py-2'>{product.id}</td>
                <td className='border border-gray-300 px-4 py-2'>{product.product}</td>
                <td className='border border-gray-300 px-4 py-2'>{product.category}</td>
                <td className='border border-gray-300 px-4 py-2'>{product.price}</td>
                <td className='border border-gray-300 px-4 py-2'>{product.sales}</td>
                <td className='border border-gray-300 px-4 py-2'>{product.stock}</td>
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
