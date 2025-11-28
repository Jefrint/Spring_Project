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
      setOrders(res.data as Order[])
    } catch (err: any) {
      setError(err?.response?.data || 'Failed to load orders')
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="container py-4">

      <h2 className="fw-bold mb-4">📦 Your Orders</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {orders.length === 0 ? (
        <div className="alert alert-info text-center py-4 fs-5">
          You have no orders yet.
        </div>
      ) : (
        <div className="row g-4">
          {orders.map((o, idx) => {
            const total = o.items?.reduce(
              (sum, it) => sum + it.quantity * it.items.price,
              0
            ) ?? 0

            return (
              <div key={idx} className="col-md-12">
                <div 
                  className="card shadow-sm border-0"
                  style={{ borderRadius: "12px" }}
                >
                  <div className="card-body">

                    {/* HEADER DETAILS */}
                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                      <div>
                        <h5 className="fw-bold mb-1">Order #{o.id}</h5>
                        <small className="text-muted">
                          Placed on: {o.date || "Unknown date"}
                        </small>
                      </div>

                      <div className="text-end">
                        <span
                          className={`badge px-3 py-2 ${
                            o.status === "DELIVERED"
                              ? "bg-success"
                              : o.status === "PENDING"
                              ? "bg-warning text-dark"
                              : "bg-secondary"
                          }`}
                          style={{ fontSize: "14px" }}
                        >
                          {o.status}
                        </span>
                      </div>
                    </div>

                    <hr />

                    {/* ORDER ITEMS LIST */}
                    <div className="mb-3">
                      {o.items?.map((it, i2) => (
                        <div
                          key={i2}
                          className="d-flex justify-content-between align-items-center py-2"
                        >
                          <div>
                            <strong className="d-block">{it.items.name}</strong>
                            <small className="text-muted">
                              Qty: {it.quantity}
                            </small>
                          </div>

                          <div className="text-end">
                            <span className="fw-semibold text-primary">
                              ₹ {it.items.price}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* TOTAL SECTION */}
                    <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded">
                      <strong className="fs-5">Total Amount</strong>
                      <span className="fs-5 text-success fw-bold">₹ {total}</span>
                    </div>

                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Orders
