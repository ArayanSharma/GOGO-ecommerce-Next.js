'use client'

import React, { useEffect, useMemo, useState } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const inrFormatter = new Intl.NumberFormat('en-IN', {
	style: 'currency',
	currency: 'INR',
	maximumFractionDigits: 2,
})

const formatCurrency = (value) => inrFormatter.format(Number(value || 0))

const formatDate = (value) => {
	try {
		return new Date(value).toLocaleString()
	} catch {
		return 'N/A'
	}
}

const statusClasses = {
	placed: 'bg-blue-100 text-blue-700',
	confirmed: 'bg-indigo-100 text-indigo-700',
	packed: 'bg-amber-100 text-amber-700',
	shipped: 'bg-cyan-100 text-cyan-700',
	delivered: 'bg-emerald-100 text-emerald-700',
	cancelled: 'bg-red-100 text-red-700',
}

const getOrderPreviewImage = (order) => {
	if (!Array.isArray(order?.items) || order.items.length === 0) {
		return ''
	}

	return order.items[0]?.image || ''
}

const OrdersPage = () => {
	const [orders, setOrders] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		const loadOrders = async () => {
			try {
				setLoading(true)
				setError('')

				const response = await fetch(`${API_BASE_URL}/api/orders`, {
					method: 'GET',
					cache: 'no-store',
					credentials: 'include',
				})

				const result = await response.json()

				if (!response.ok || result?.success === false) {
					throw new Error(result?.message || 'Failed to fetch orders')
				}

				setOrders(Array.isArray(result?.data) ? result.data : [])
			} catch (loadError) {
				setError(loadError.message || 'Failed to fetch orders')
			} finally {
				setLoading(false)
			}
		}

		loadOrders()
	}, [])

	const stats = useMemo(() => {
		const totalOrders = orders.length
		const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0)
		const pendingOrders = orders.filter((order) => String(order.orderStatus) !== 'delivered').length

		return { totalOrders, totalRevenue, pendingOrders }
	}, [orders])

	return (
		<section className='min-h-screen bg-[radial-gradient(circle_at_0%_0%,#ecfccb,transparent_35%),radial-gradient(circle_at_90%_20%,#fde68a,transparent_30%),linear-gradient(150deg,#f8fafc_0%,#fffbeb_40%,#fefce8_100%)] p-6'>
			<div className='mx-auto max-w-7xl'>
				<div className='mb-6 rounded-3xl border border-white/70 bg-white/75 p-6 shadow-lg backdrop-blur'>
					<p className='text-xs font-bold uppercase tracking-[0.24em] text-amber-600'>Dashboard</p>
					<h1 className='mt-2 text-3xl font-bold text-slate-900'>Orders</h1>
					<p className='mt-1 text-sm text-slate-600'>Live order feed from your store checkout.</p>

					<div className='mt-5 grid gap-4 sm:grid-cols-3'>
						<div className='rounded-2xl border border-amber-100 bg-amber-50/70 p-4'>
							<p className='text-xs font-semibold uppercase tracking-[0.16em] text-amber-700'>Total Orders</p>
							<p className='mt-2 text-2xl font-bold text-amber-900'>{stats.totalOrders}</p>
						</div>
						<div className='rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4'>
							<p className='text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700'>Revenue</p>
							<p className='mt-2 text-2xl font-bold text-emerald-900'>{formatCurrency(stats.totalRevenue)}</p>
						</div>
						<div className='rounded-2xl border border-blue-100 bg-blue-50/70 p-4'>
							<p className='text-xs font-semibold uppercase tracking-[0.16em] text-blue-700'>Pending</p>
							<p className='mt-2 text-2xl font-bold text-blue-900'>{stats.pendingOrders}</p>
						</div>
					</div>
				</div>

				<div className='overflow-hidden rounded-3xl border border-white/70 bg-white/85 shadow-lg backdrop-blur'>
					<div className='border-b border-slate-100 px-6 py-4'>
						<h2 className='text-lg font-semibold text-slate-800'>Order List</h2>
					</div>

					{loading ? (
						<div className='px-6 py-10 text-slate-600'>Loading orders...</div>
					) : error ? (
						<div className='px-6 py-10 text-red-600'>{error}</div>
					) : orders.length === 0 ? (
						<div className='px-6 py-10 text-slate-600'>No orders found yet.</div>
					) : (
						<div className='overflow-x-auto'>
							<table className='min-w-full text-sm'>
								<thead className='bg-slate-50 text-left text-xs uppercase tracking-[0.12em] text-slate-500'>
									<tr>
										<th className='px-6 py-3'>Order</th>
										<th className='px-6 py-3'>Image</th>
										<th className='px-6 py-3'>Customer</th>
										<th className='px-6 py-3'>Items</th>
										<th className='px-6 py-3'>Total</th>
										<th className='px-6 py-3'>Status</th>
										<th className='px-6 py-3'>Placed At</th>
									</tr>
								</thead>
								<tbody>
									{orders.map((order) => {
										const previewImage = getOrderPreviewImage(order)

										return (
										<tr key={order._id} className='border-t border-slate-100'>
											<td className='px-6 py-4'>
												<p className='font-semibold text-slate-900'>{order.orderNumber || 'N/A'}</p>
												<p className='text-xs text-slate-500'>{order.paymentMethod || 'COD'}</p>
											</td>
											<td className='px-6 py-4'>
												{previewImage ? (
													<img
														src={previewImage}
														alt={order.items?.[0]?.name || 'Order item'}
														className='h-12 w-12 rounded-lg border border-slate-200 object-cover'
													/>
												) : (
													<div className='flex h-12 w-12 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-[10px] font-semibold uppercase text-slate-400'>
														No Img
													</div>
												)}
											</td>
											<td className='px-6 py-4'>
												<p className='font-medium text-slate-800'>{order.deliveryAddress?.name || 'N/A'}</p>
												<p className='text-xs text-slate-500'>{order.userEmail || 'N/A'}</p>
											</td>
											<td className='px-6 py-4 text-slate-700'>{Array.isArray(order.items) ? order.items.length : 0}</td>
											<td className='px-6 py-4 font-semibold text-emerald-700'>{formatCurrency(order.totalAmount)}</td>
											<td className='px-6 py-4'>
												<span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses[order.orderStatus] || 'bg-slate-100 text-slate-700'}`}>
													{order.orderStatus || 'placed'}
												</span>
											</td>
											<td className='px-6 py-4 text-slate-600'>{formatDate(order.createdAt)}</td>
										</tr>
										)
									})}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</div>
		</section>
	)
}

export default OrdersPage
