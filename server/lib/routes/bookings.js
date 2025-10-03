import express from "express";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

router.get("/movies/:id/shows", async (req, res) => {
  const movieId = req.params.id;

  const { data, error } = await supabase
    .from("shows")
    .select(`
      id,
      show_date,
      show_time,
      theatres (
        name,
        location
      )
    `)
    .eq("movie_id", movieId);

  if (error) 
    return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post("/bookings", async (req, res) => {
  const { movie_id, theatre_id, show_id, user_name, seats } = req.body;

  if (!movie_id || !theatre_id || !show_id || !user_name || !seats) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const { data, error } = await supabase
    .from("bookings")
    .insert([{ movie_id, theatre_id, show_id, user_name, seats }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: "Booking successful", booking: data });
});

// Simple frontend form for creating a booking
router.get("/bookings/form", (req, res) => {
  res.type("html").send(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Create Booking</title>
    <style>
      body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; padding: 24px; max-width: 720px; margin: 0 auto; }
      h1 { font-size: 22px; margin-bottom: 16px; }
      form { display: grid; gap: 12px; }
      label { display: grid; gap: 6px; font-weight: 600; }
      input { padding: 10px 12px; font-size: 14px; border: 1px solid #ccc; border-radius: 6px; }
      button { cursor: pointer; background: #0f766e; color: white; border: 0; padding: 10px 14px; border-radius: 6px; font-weight: 600; }
      .row { display: grid; gap: 8px; }
      .msg { margin-top: 12px; font-weight: 600; }
      .error { color: #b91c1c; }
      .success { color: #065f46; }
    </style>
  </head>
  <body>
    <h1>Create a Booking</h1>
    <form id="bookingForm">
      <label class="row">
        <span>Movie ID</span>
        <input type="text" id="movie_id" placeholder="e.g. 1" required />
      </label>
      <label class="row">
        <span>Theatre ID</span>
        <input type="text" id="theatre_id" placeholder="e.g. 2" required />
      </label>
      <label class="row">
        <span>Show ID</span>
        <input type="text" id="show_id" placeholder="e.g. 3" required />
      </label>
      <label class="row">
        <span>User Name</span>
        <input type="text" id="user_name" placeholder="e.g. janedoe" required />
      </label>
      <label class="row">
        <span>Seats</span>
        <input type="number" id="seats" min="1" step="1" placeholder="e.g. 2" required />
      </label>
      <button type="submit">Submit Booking</button>
      <div id="message" class="msg"></div>
    </form>
    <script>
      const form = document.getElementById('bookingForm');
      const msg = document.getElementById('message');
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        msg.textContent = '';
        msg.className = 'msg';
        const payload = {
          movie_id: document.getElementById('movie_id').value.trim(),
          theatre_id: document.getElementById('theatre_id').value.trim(),
          show_id: document.getElementById('show_id').value.trim(),
          user_name: document.getElementById('user_name').value.trim(),
          seats: Number(document.getElementById('seats').value)
        };
        if (!payload.movie_id || !payload.theatre_id || !payload.show_id || !payload.user_name || !payload.seats) {
          msg.textContent = 'Please fill all fields.';
          msg.className = 'msg error';
          return;
        }
        try {
          const res = await fetch('/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const body = await res.json();
          if (!res.ok) {
            throw new Error(body.error || 'Failed to create booking');
          }
          msg.textContent = body.message || 'Booking successful!';
          msg.className = 'msg success';
          form.reset();
        } catch (err) {
          msg.textContent = err.message;
          msg.className = 'msg error';
        }
      });
    </script>
  </body>
</html>`);
});

export default router;