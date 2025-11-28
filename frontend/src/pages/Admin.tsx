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

  /** FIX 1: Normalize roles */
  const rawRoles = getRoles()
  console.log("Roles are:", rawRoles);

  const roles = Array.isArray(rawRoles) ? rawRoles : [rawRoles]

  const isAdmin = roles.includes("ROLE_ADMIN")

  /** ADD ITEM */
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/items', { name, category, price, quantity })
      navigate('/items')
    } catch (err: any) {
      setError(err?.response?.data || 'Failed to add item')
    }
  }

  /** LOAD ADMIN ORDERS */
  const loadAdminOrders = async () => {
    if (!isAdmin) return
    setLoadingOrders(true)
    try {
      const res = await api.get('/orders/admin')
      setAdminOrders(res.data)
    } catch (err: any) {
      setApproveError(err?.response?.data || 'Failed to load orders')
    } finally {
      setLoadingOrders(false)
    }
  }

  /** LOAD ADMIN CARTS */
  const loadAdminCarts = async () => {
    if (!isAdmin) return
    setLoadingCarts(true)
    try {
      const res = await api.get('/cart/admin')
      setAdminCarts(res.data)
    } catch (err: any) {
      setCartError(err?.response?.data || 'Failed to load admin carts')
    } finally {
      setLoadingCarts(false)
    }
  }

  useEffect(() => {
    loadAdminOrders()
    loadAdminCarts()
  }, [])

  /** APPROVE ORDER */
  const approve = async (orderId?: number) => {
    if (!orderId) return
    try {
      await api.post('/orders/admin/approve', null, { params: { order_id: orderId } })
      loadAdminOrders()
    } catch (err: any) {
      setApproveError(err?.response?.data || 'Failed to approve order')
    }
  }

  /** CHECKOUT USER CART */
  const checkoutCart = async (userId?: number) => {
    if (!userId) return
    try {
      await api.post('/cart/admin/checkout', null, { params: { user_id: userId } })
      loadAdminCarts()
      loadAdminOrders()
    } catch (err: any) {
      setCartError(err?.response?.data || 'Failed to checkout cart')
    }
  }

  return (
    <div className="container py-4">

      {/* PAGE HEADER */}
      <h2 className="fw-bold mb-4">🛠 Admin Dashboard</h2>

      {/* ADD ITEM FORM */}
      <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: '12px' }}>
        <div className="card-body">
          <h4 className="fw-bold mb-3">➕ Add New Product</h4>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={submit} className="row g-3">

            <div className="col-md-6">
              <label className="form-label fw-semibold">Name</label>
              <input className="form-control" value={name} onChange={e => setName(e.target.value)} />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Category</label>
              <input className="form-control" value={category} onChange={e => setCategory(e.target.value)} />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Price</label>
              <input type="number" className="form-control" value={price} onChange={e => setPrice(Number(e.target.value))} />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Quantity</label>
              <input type="number" className="form-control" value={quantity} onChange={e => setQuantity(Number(e.target.value))} />
            </div>

            <div className="col-12">
              <button className="btn btn-primary btn-lg w-100">Add Item</button>
            </div>

          </form>
        </div>
      </div>

      {/* ADMIN ORDERS */}
      {isAdmin && (
        <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: '12px' }}>
          <div className="card-body">
            <h4 className="fw-bold mb-3">📦 Orders Today</h4>

            {loadingOrders && <div>Loading orders...</div>}
            {approveError && <div className="alert alert-danger">{approveError}</div>}

            {adminOrders.length === 0 ? (
              <div className="alert alert-info">No orders for today</div>
            ) : (
              <div className="list-group">
                {adminOrders.map((ord: any) => (
                  <div key={ord.id} className="list-group-item d-flex justify-content-between align-items-center">

                    <div>
                      <strong>Order #{ord.id}</strong><br />
                      <small>User: {ord.user_id}</small><br />
                      <small>Items: {ord.items?.length || 0}</small><br />
                      <small>Status: {ord.status}</small>
                    </div>

                    {ord.status === 'pending' && (
                      <button className="btn btn-success" onClick={() => approve(ord.id)}>
                        Approve
                      </button>
                    )}

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADMIN CARTS */}
      {isAdmin && (
        <div className="card shadow-sm border-0" style={{ borderRadius: '12px' }}>
          <div className="card-body">
            <h4 className="fw-bold mb-3">🛒 User Carts</h4>

            {loadingCarts && <div>Loading carts...</div>}
            {cartError && <div className="alert alert-danger">{cartError}</div>}

            {adminCarts.length === 0 ? (
              <div className="alert alert-info">No user carts</div>
            ) : (
              <>
                {Object.entries(
                  adminCarts.reduce((acc: any, c: any) => {
                    (acc[c.userId] = acc[c.userId] || []).push(c)
                    return acc
                  }, {})
                ).map(([userId, carts]: any) => (
                  <div key={userId} className="mb-4">

                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="fw-semibold">User {userId}</h6>
                      <button className="btn btn-primary" onClick={() => checkoutCart(Number(userId))}>
                        Checkout User Cart
                      </button>
                    </div>

                    <ul className="list-group">
                      {carts.map((cartItem: any) => (
                        <li key={cartItem.id} className="list-group-item">
                          {cartItem.name} — Qty: {cartItem.quantity}
                        </li>
                      ))}
                    </ul>

                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}

    </div>
  )
}

export default Admin
