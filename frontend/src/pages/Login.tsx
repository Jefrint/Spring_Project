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
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "90vh" }}>

      <div 
        className="card shadow-lg border-0 p-4"
        style={{
          width: "420px",
          borderRadius: "18px",
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(10px)"
        }}
      >

        {/* Header */}
        <div 
          className="text-center mb-4 p-3 rounded"
          style={{
            background: "linear-gradient(90deg, #4c6ef5, #845ef7, #f06595)",
            color: "white"
          }}
        >
          <h3 className="mb-0 fw-bold">Welcome Back</h3>
          <small>Login to continue</small>
        </div>

        {/* Error */}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Form */}
        <form onSubmit={submit}>

          <div className="mb-3">
            <label className="form-label fw-semibold">Username or Email</label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <i className="bi bi-person"></i>
              </span>
              <input 
                type="text"
                className="form-control"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ borderRadius: "8px" }}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <i className="bi bi-lock"></i>
              </span>
              <input 
                type="password"
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ borderRadius: "8px" }}
              />
            </div>
          </div>

          {/* Login Button */}
          <button 
            className="btn btn-primary w-100 py-2 fw-bold"
            style={{
              borderRadius: "10px",
              background: "linear-gradient(90deg, #4c6ef5, #845ef7)",
              border: "none"
            }}
          >
            Login
          </button>

        </form>

        {/* Register Link */}
        <div className="text-center mt-3">
          <small>
            Don't have an account?{" "}
            <a href="/register" className="fw-semibold" style={{ color: "#845ef7" }}>
              Register
            </a>
          </small>
        </div>

      </div>

    </div>
  )
}

export default Login
