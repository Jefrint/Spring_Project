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
    await api.post('/cart', {
      userId,
      item_id: item.id,
      quantity: qty,
      price: item.price,
      name: item.name,
      category: item.category
    })
    alert('Added to cart')
  }

  if (!item) return <div className="text-center py-5">Loading...</div>

  return (
    <div className="container py-4">
      
      <div className="row">

        {/* LEFT SIDE — Product Image */}
        <div className="col-md-6 mb-4">
          <div
            className="shadow-sm rounded"
            style={{
              overflow: "hidden",
              background: "#f8f9fa",
              height: "400px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <img
              src="https://picsum.photos/600/400"   // SAMPLE IMAGE
              alt={item.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>

        {/* RIGHT SIDE — Details */}
        <div className="col-md-6">
          <div className="p-3">

            {/* PRODUCT NAME */}
            <h2 className="fw-bold mb-2">{item.name}</h2>

            {/* CATEGORY */}
            {item.category && (
              <span className="badge bg-secondary mb-3">{item.category}</span>
            )}

            {/* DESCRIPTION */}
            <p className="text-muted" style={{ fontSize: "15px" }}>
              {item.description || "No description available."}
            </p>

            {/* PRICE */}
            <div className="my-3">
              <span className="badge bg-success p-3 fs-5">
                ₹ {item.price}
              </span>
            </div>

            {/* QUANTITY SELECTOR */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Quantity</label>
              <input
                type="number"
                value={qty}
                className="form-control"
                min={1}
                onChange={(e) => setQty(Number(e.target.value))}
                style={{ width: "120px" }}
              />
            </div>

            {/* ADD TO CART BUTTON */}
            <button
              className="btn btn-primary btn-lg w-100 mt-3"
              onClick={addToCart}
              style={{ borderRadius: "10px" }}
            >
              🛒 Add to Cart
            </button>

            {/* STOCK INFO */}
            <p className="text-muted mt-3">
              {item.quantity > 0 ? (
                <span>In stock: {item.quantity}</span>
              ) : (
                <span className="text-danger">Out of Stock</span>
              )}
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ItemDetails
