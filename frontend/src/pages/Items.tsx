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
}

const Items: React.FC = () => {
  const [items, setItems] = useState<Item[]>([])

  useEffect(() => {
    api.get('/items')
      .then(res => setItems(res.data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div>
      <h2>Items</h2>
      <div className="row">
        {items.map(item => (
          <div className="col-md-4 mb-3" key={item.id}>
            <div className="card h-100">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{item.name}</h5>
                <p className="card-text">{item.category} - ${item.price}</p>
                <p className="card-text">{item.description}</p>
                <div className="mt-auto">
                  <Link to={`/items/${item.id}`} className="btn btn-primary me-2">View</Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Items
