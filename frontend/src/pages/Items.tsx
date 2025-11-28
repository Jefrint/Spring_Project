import React, { useEffect, useState } from 'react'
import api from '../api'
import { Link } from 'react-router-dom'

type Item = {
  id: number
  name: string
  price: number
  quantity: number
  description?: string
  category?: string
  imageUrl?: string
}

const Items: React.FC = () => {
  const [items, setItems] = useState<Item[]>([])

  useEffect(() => {
    api.get('/items')
      .then(res => setItems(res.data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="container py-4">

      {/* Page Title */}
      <h2 className="mb-4 fw-bold text-center">
        🛍️ Explore Our Products
      </h2>

      <div className="row g-4">
        {items.map(item => (
          <div className="col-md-4" key={item.id}>
            <div 
              className="card shadow-sm border-0 h-100"
              style={{ transition: "0.3s", borderRadius: "12px" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0px)")}
            >

              {/* Image Placeholder */}
              <div
                className="bg-light d-flex justify-content-center align-items-center"
                style={{ height: "200px", borderTopLeftRadius: "12px", borderTopRightRadius: "12px" }}
              >
                {/* {item.imageUrl ? (
                  <img 
                    src={item.imageUrl} 
                    alt={item.name}
                    style={{ maxHeight: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <span className="text-muted">No Image Available</span>
                )
                }
                 */}

                 <img src="https://picsum.photos/400/300"
                  alt={item.name}
                 style={{
                 width: "100%",
                  height: "100%",
                objectFit: "cover",
                    borderTopLeftRadius: "12px",
                      borderTopRightRadius: "12px"
                     }} />

              </div>

              <div className="card-body d-flex flex-column">

                {/* Title + Price */}
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-1 fw-semibold">{item.name}</h5>
                  <span className="badge bg-primary px-3 py-2">${item.price}</span>
                </div>

                {/* Category */}
                {item.category && (
                  <span className="badge bg-secondary mb-2">{item.category}</span>
                )}

                {/* Description */}
                {item.description && (
                  <p className="text-muted small">{item.description}</p>
                )}

                <div className="mt-auto d-flex">
                  <Link
                    to={`/items/${item.id}`}
                    className="btn btn-outline-primary me-2 w-50"
                  >
                    View
                  </Link>

                  <button
                    className="btn btn-primary w-50"
                    disabled={item.quantity === 0}
                  >
                    {item.quantity === 0 ? "Out of Stock" : "Add to Cart"}
                  </button>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No items found */}
      {items.length === 0 && (
        <p className="text-center text-muted mt-5">No items available.</p>
      )}
    </div>
  )
}

export default Items
