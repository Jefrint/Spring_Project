import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import { saveAuth } from '../utils/auth'

const Login: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await api.post('/auth/login', { usernameOrEmail: username, password })
      const data = res.data
      if (data && data.accessToken) {
        const roles = data.roles ? data.roles.map((r: any) => r.name) : []
        saveAuth(data.accessToken, data.userId, roles)
        navigate('/')
      }
    } catch (err: any) {
      setError(err?.response?.data || 'Login failed')
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <h2>Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label">Username or Email</label>
            <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button className="btn btn-primary">Login</button>
        </form>
      </div>
    </div>
  )
}

export default Login
