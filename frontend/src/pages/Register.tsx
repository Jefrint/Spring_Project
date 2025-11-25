import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

const Register: React.FC = () => {
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [personalNo, setPersonalNo] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/auth/register', { name, username, email, password, personalNo: parseInt(personalNo || '0') })
      navigate('/login')
    } catch (err: any) {
      setError(err?.response?.data || 'Registration failed')
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <h2>Register</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>

          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div className="mb-3">
            <label className="form-label">Personal No</label>
            <input type="text" className="form-control" value={personalNo} onChange={(e) => setPersonalNo(e.target.value)} />
          </div>

          <button className="btn btn-primary">Register</button>
        </form>
      </div>
    </div>
  )
}

export default Register
