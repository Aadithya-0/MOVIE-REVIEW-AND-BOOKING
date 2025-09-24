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

export default router;