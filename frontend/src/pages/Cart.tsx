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
    await api.put('/cart', newCart.map(i => ({...i})))
    await loadCart()
  }

  const checkout = async () => {
    const userId = getUserId()
    if (!userId) return
    await api.get(`/cart/checkout?user_id=${userId}`)
    await loadCart()
  }

  return (
    <div>
      <h2>Cart</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {items.length === 0 && <p>Cart is empty</p>}
      <ul className="list-group">
        {items.map(item => (
          <li className="list-group-item d-flex justify-content-between align-items-center" key={item.id}>
            <div>
              <strong>{item.name}</strong> <br />
              {item.category} - ${item.price}
            </div>
            <div>
              <input type="number" className="form-control d-inline-block me-2" style={{width: '80px'}} value={item.quantity} onChange={(e) => updateQuantity(item, Number(e.target.value))} />
              <button className="btn btn-danger" onClick={() => removeItem(item.item_id)}>Remove</button>
            </div>
          </li>
        ))}
      </ul>
      {items.length > 0 && <div className="mt-3"><button className="btn btn-success" onClick={checkout}>Checkout</button></div>}
    </div>
  )
}

export default Cart
