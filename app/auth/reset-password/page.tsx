"use client"

import { useState } from "react"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!password || !confirmPassword) {
      setError("Please fill in all fields.")
    } else if (password !== confirmPassword) {
      setError("Passwords do not match.")
    } else {
      setError("")
      setMessage("Your password has been reset (demo).")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {message && <div className="text-green-600 text-sm">{message}</div>}
        <div>
          <label className="block text-sm font-medium mb-1">New Password</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Confirm Password</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Reset Password</button>
        <div className="text-center mt-2">
          <a href="/auth/login" className="text-blue-600 hover:underline text-sm">Back to Login</a>
        </div>
      </form>
    </div>
  )
} 