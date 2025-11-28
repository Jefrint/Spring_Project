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
      await api.post('/auth/register', {
        name,
        username,
        email,
        password,
        personalNo: parseInt(personalNo || '0'),
      })
      navigate('/login')
    } catch (err: any) {
      setError(err?.response?.data || 'Registration failed')
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "90vh" }}>

      <div
        className="card shadow-lg border-0 p-4"
        style={{
          width: "480px",
          borderRadius: "18px",
          background: "rgba(255, 255, 255, 0.88)",
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
          <h3 className="mb-0 fw-bold">Create Your Account</h3>
          <small>Join our shopping community today</small>
        </div>

        {/* Error */}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={submit}>

          {/* Username */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Username</label>
            <div className="input-group">
              <span className="input-group-text bg-light"><i className="bi bi-person"></i></span>
              <input
                type="text"
                className="form-control"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ borderRadius: "8px" }}
              />
            </div>
          </div>

          {/* Name */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Full Name</label>
            <div className="input-group">
              <span className="input-group-text bg-light"><i className="bi bi-person-badge"></i></span>
              <input
                type="text"
                className="form-control"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ borderRadius: "8px" }}
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <div className="input-group">
              <span className="input-group-text bg-light"><i className="bi bi-envelope"></i></span>
              <input
                type="email"
                className="form-control"
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ borderRadius: "8px" }}
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light"><i className="bi bi-lock"></i></span>
              <input
                type="password"
                className="form-control"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ borderRadius: "8px" }}
              />
            </div>
          </div>

          {/* Personal No */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Personal Number</label>
            <div className="input-group">
              <span className="input-group-text bg-light"><i className="bi bi-hash"></i></span>
              <input
                type="number"
                className="form-control"
                placeholder="Enter your personal ID"
                value={personalNo}
                onChange={(e) => setPersonalNo(e.target.value)}
                required
                style={{ borderRadius: "8px" }}
              />
            </div>
          </div>

          {/* Register Button */}
          <button
            className="btn btn-primary w-100 py-2 fw-bold"
            style={{
              borderRadius: "10px",
              background: "linear-gradient(90deg, #4c6ef5, #845ef7)",
              border: "none"
            }}
          >
            Create Account
          </button>

        </form>

        {/* Login Link */}
        <div className="text-center mt-3">
          <small>
            Already have an account?{" "}
            <a href="/login" className="fw-semibold" style={{ color: "#845ef7" }}>
              Login
            </a>
          </small>
        </div>

      </div>
    </div>
  )
}

export default Register
