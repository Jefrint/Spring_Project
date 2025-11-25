import React, { useEffect, useState } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'
import { getRoles } from '../utils/auth'

const Admin: React.FC = () => {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState<number>(0)
  const [quantity, setQuantity] = useState<number>(0)
  const [error, setError] = useState('')
  const [adminOrders, setAdminOrders] = useState<any[]>([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [approveError, setApproveError] = useState('')
  const [adminCarts, setAdminCarts] = useState<any[]>([])
  const [loadingCarts, setLoadingCarts] = useState(false)
  const [cartError, setCartError] = useState('')
  const navigate = useNavigate()
  const roles = getRoles()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/items', { name, category, price, quantity })
      navigate('/items')
    } catch (err: any) {
      setError(err?.response?.data || 'Failed to add item')
    }
  }

  // Load admin orders (today) if admin
  const loadAdminOrders = async () => {
    if (!roles.includes('ROLE_ADMIN')) return
    setLoadingOrders(true)
    try {
      const res = await api.get('/orders/admin/today')
      setAdminOrders(res.data)
    } catch (err: any) {
      setApproveError(err?.response?.data || 'Failed to load admin orders')
    } finally {
      setLoadingOrders(false)
    }
  }

  useEffect(() => {
    loadAdminOrders()
    loadAdminCarts()
  }, [])

  const approve = async (orderId?: number) => {
    if (!orderId) return
    try {
      await api.post('/orders/admin/approve', null, { params: { order_id: orderId } })
      // refresh
      await loadAdminOrders()
    } catch (err: any) {
      setApproveError(err?.response?.data || 'Failed to approve order')
    }
  }

  const loadAdminCarts = async () => {
    if (!roles.includes('ROLE_ADMIN')) return
    setLoadingCarts(true)
    try {
      const res = await api.get('/cart/admin')
      setAdminCarts(res.data)
    } catch (err: any) {
      setCartError(err?.response?.data || 'Failed to load cart items')
    } finally {
      setLoadingCarts(false)
    }
  }

  const checkoutCart = async (userId?: number) => {
    if (!userId) return
    try {
      await api.post('/cart/admin/checkout', null, { params: { user_id: userId } })
      // reload
      await loadAdminCarts()
      await loadAdminOrders()
    } catch (err: any) {
      setCartError(err?.response?.data || 'Failed to checkout cart')
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <h2>Add Item</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input className="form-control" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Category</label>
            <input className="form-control" value={category} onChange={e => setCategory(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Price</label>
            <input type="number" className="form-control" value={price} onChange={e => setPrice(Number(e.target.value))} />
          </div>
          <div className="mb-3">
            <label className="form-label">Quantity</label>
            <input type="number" className="form-control" value={quantity} onChange={e => setQuantity(Number(e.target.value))} />
          </div>
          <button className="btn btn-primary">Add Item</button>
        </form>
        {roles.includes('ROLE_ADMIN') && (
          <div className="mt-5">
            <h3>Admin Orders (Today)</h3>
            {loadingOrders && <div>Loading orders...</div>}
            {approveError && <div className="alert alert-danger">{approveError}</div>}
            {adminOrders.length === 0 ? (
              <div className="alert alert-info">No admin orders found</div>
            ) : (
              <ul className="list-group">
                {adminOrders.map((ord: any) => (
                  <li key={ord.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      Order #{ord.id} - User: {ord.user_id} - Status: {ord.status} - Items: {ord.items?.length || 0}
                    </div>
                    <div>
                      {ord.status === 'pending' && (
                        <button className="btn btn-success" onClick={() => approve(ord.id)}>Approve</button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {roles.includes('ROLE_ADMIN') && (
          <div className="mt-5">
            <h3>Admin Carts</h3>
            {loadingCarts && <div>Loading carts...</div>}
            {cartError && <div className="alert alert-danger">{cartError}</div>}
            {adminCarts.length === 0 ? (
              <div className="alert alert-info">No cart items</div>
            ) : (
              <div>
                {/* Group cart items by user */}
                {Object.entries(adminCarts.reduce((acc: any, c: any) => {
                  (acc[c.userId] = acc[c.userId] || []).push(c);
                  return acc;
                }, {})).map(([userId, carts]: any) => (
                  <div key={userId} className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <strong>User {userId}</strong>
                      <button className="btn btn-primary" onClick={() => checkoutCart(Number(userId))}>Checkout User Cart</button>
                    </div>
                    <ul className="list-group">
                      {carts.map((cartItem: any) => (
                        <li key={cartItem.id} className="list-group-item">Item: {cartItem.name} (id: {cartItem.item_id}) - Qty: {cartItem.quantity}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin
