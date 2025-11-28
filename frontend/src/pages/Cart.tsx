import React, { useEffect, useState } from 'react'
import api from '../api'
import { getUserId } from '../utils/auth'

type CartItem = {
  id: number
  userId: number
  item_id: number
  name: string
  quantity: number
  price: number
  category?: string
}

const Cart: React.FC = () => {
  const [items, setItems] = useState<CartItem[]>([])
  const [error, setError] = useState('')

  async function loadCart() {
    const userId = getUserId()
    if (!userId) {
      setError('Please login')
      return
    }
    try {
      const res = await api.get(`/cart?user_id=${userId}`)
      setItems(res.data)
    } catch (err: any) {
      setError(err?.response?.data || 'Failed to load cart')
    }
  }

  useEffect(() => { loadCart() }, [])

  const removeItem = async (item_id: number) => {
    const userId = getUserId()
    if (!userId) return
    await api.delete(`/cart?user_id=${userId}&item_id=${item_id}`)
    await loadCart()
  }

  const updateQuantity = async (item: CartItem, qty: number) => {
    const newCart = items.map(i => i.id === item.id ? { ...i, quantity: qty } : i)
    await api.put('/cart', newCart.map(i => ({ ...i })))
    await loadCart()
  }

  const checkout = async () => {
    const userId = getUserId()
    if (!userId) return
    await api.get(`/cart/checkout?user_id=${userId}`)
    await loadCart()
  }

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <div className="container py-4">

      <h2 className="fw-bold mb-4">🛒 Your Cart</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {items.length === 0 && <p className="text-muted">Your cart is empty.</p>}

      <div className="row">
        <div className="col-lg-8">

          {items.map(item => (
            <div 
              key={item.id}
              className="card mb-3 shadow-sm border-0"
              style={{ borderRadius: "12px" }}
            >
              <div className="row g-0 align-items-center">

                {/* IMAGE */}
                <div className="col-md-3">
                  <div
                    style={{
                      height: "150px",
                      overflow: "hidden",
                      borderTopLeftRadius: "12px",
                      borderBottomLeftRadius: "12px"
                    }}
                  >
                    <img
                      src="https://picsum.photos/300/200" // TEMP IMAGE
                      alt={item.name}
                      className="img-fluid"
                      style={{ height: "100%", width: "100%", objectFit: "cover" }}
                    />
                  </div>
                </div>

                {/* DETAILS */}
                <div className="col-md-6 px-3 py-3">
                  <h5 className="mb-1">{item.name}</h5>
                  <p className="text-muted small mb-2">{item.category}</p>

                  <span className="fw-bold fs-5 text-primary">
                    ₹ {item.price}
                  </span>
                </div>

                {/* ACTIONS */}
                <div className="col-md-3 px-3 py-3 text-center">

                  {/* Quantity */}
                  <select
                    className="form-select mb-2"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item, Number(e.target.value))}
                    style={{ borderRadius: "8px" }}
                  >
                    {[1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>

                  {/* Remove button */}
                  <button
                    className="btn btn-outline-danger w-100"
                    style={{ borderRadius: "8px" }}
                    onClick={() => removeItem(item.item_id)}
                  >
                    ❌ Remove
                  </button>

                </div>

              </div>
            </div>
          ))}

        </div>

        {/* BILLING SECTION */}
        {items.length > 0 && (
          <div className="col-lg-4">
            <div
              className="card shadow-sm border-0"
              style={{ borderRadius: "12px" }}
            >
              <div className="card-body">

                <h5 className="fw-bold mb-3">Order Summary</h5>

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Items:</span>
                  <span>{items.length}</span>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Total Quantity:</span>
                  <span>{items.reduce((sum, i) => sum + i.quantity, 0)}</span>
                </div>

                <hr />

                <div className="d-flex justify-content-between">
                  <h5>Total</h5>
                  <h5 className="text-success fw-bold">₹ {total}</h5>
                </div>

                <button
                  className="btn btn-success w-100 mt-3 btn-lg"
                  style={{ borderRadius: "10px" }}
                  onClick={checkout}
                >
                  ✅ Proceed to Checkout
                </button>

              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  )
}

export default Cart
