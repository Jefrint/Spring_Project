import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api'
import { getUserId, getRoles } from '../utils/auth'

const ItemDetails: React.FC = () => {
  const { id } = useParams()
  const [item, setItem] = useState<any>(null)
  const [qty, setQty] = useState(1)

  useEffect(() => {
    if (!id) return
    api.get(`/items/user/${id}`)
      .then(res => setItem(res.data))
      .catch(err => console.error(err))
  }, [id])

  const roles = getRoles()

  const addToCart = async () => {
    const userId = getUserId()
    if (!userId) {
      alert('Please login')
      return
    }
    if (roles.includes('ROLE_ADMIN')) {
      alert('Admins cannot buy products')
      return
    }
    await api.post('/cart', { userId, item_id: item.id, quantity: qty, price: item.price, name: item.name, category: item.category })
    alert('Added to cart')
  }

  if (!item) return <div>Loading...</div>

  return (
    <div className="row">
      <div className="col-md-8">
        <h3>{item.name}</h3>
        <p>{item.category}</p>
        <p>{item.description}</p>
      </div>
      <div className="col-md-4">
        <h4>${item.price}</h4>
        <div className="mb-3">
          <label className="form-label">Quantity</label>
          <input type="number" value={qty} className="form-control" min={1} onChange={(e) => setQty(Number(e.target.value))} />
        </div>
        <button className="btn btn-primary" onClick={addToCart}>Add to Cart</button>
      </div>
    </div>
  )
}

export default ItemDetails
