import React, { useEffect, useState } from 'react'
import api from '../api'
import { getUserId } from '../utils/auth'

type OrderItem = {
  quantity: number
  items: {
    id: number
    name: string
    price: number
  }
}

type Order = {
  id?: number
  user_id?: number
  date?: string
  status?: string
  paymentStatus?: string
  items?: OrderItem[]
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [error, setError] = useState('')

  async function load() {
    const userId = getUserId()
    try {
      if (!userId) {
        setError('Please login')
        return
      }
      const res = await api.get(`/orders/user/${userId}`)
      // API returns an array of orders; setOrders directly with the response data
      setOrders(res.data as Order[])
    } catch (err: any) {
      setError(err?.response?.data || 'Failed to load orders')
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div>
      <h2>Orders</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {orders.length === 0 ? (
        <div className="alert alert-info">No orders found</div>
      ) : (
        <ul className="list-group">
          {orders.map((o, idx) => {
            const total = o.items?.reduce((sum, it) => sum + it.quantity * it.items.price, 0) ?? 0
            return (
              <li key={idx} className="list-group-item">Order #{o.id} - Total: ${total} - Status: {o.status}</li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default Orders
