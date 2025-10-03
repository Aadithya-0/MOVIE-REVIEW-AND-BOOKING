import React from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

function BookingForm() {
  const [message, setMessage] = React.useState('')
  const [isError, setIsError] = React.useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    setIsError(false)

    const form = event.currentTarget
    const payload = {
      movie_id: form.movie_id.value.trim(),
      theatre_id: form.theatre_id.value.trim(),
      show_id: form.show_id.value.trim(),
      user_name: form.user_name.value.trim(),
      seats: Number(form.seats.value)
    }

    if (!payload.movie_id || !payload.theatre_id || !payload.show_id || !payload.user_name || !payload.seats) {
      setMessage('Please fill all fields.')
      setIsError(true)
      return
    }

    try {
      const res = await fetch('http://localhost:3000/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error || 'Failed to create booking')
      setMessage(body.message || 'Booking successful!')
      form.reset()
    } catch (err) {
      setMessage(err.message)
      setIsError(true)
    }
  }

  return (
    <div className="container">
      <h1>Create a Booking</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Movie ID</span>
          <input name="movie_id" type="text" placeholder="e.g. 1" required />
        </label>
        <label>
          <span>Theatre ID</span>
          <input name="theatre_id" type="text" placeholder="e.g. 2" required />
        </label>
        <label>
          <span>Show ID</span>
          <input name="show_id" type="text" placeholder="e.g. 3" required />
        </label>
        <label>
          <span>User Name</span>
          <input name="user_name" type="text" placeholder="e.g. janedoe" required />
        </label>
        <label>
          <span>Seats</span>
          <input name="seats" type="number" min="1" step="1" placeholder="e.g. 2" required />
        </label>
        <button type="submit">Submit Booking</button>
        {message && (
          <div className={`msg ${isError ? 'error' : 'success'}`}>{message}</div>
        )}
      </form>
    </div>
  )
}

createRoot(document.getElementById('root')).render(<BookingForm />)


