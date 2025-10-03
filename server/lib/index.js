import 'dotenv/config';
import express from "express";
import profilePage from "./routes/profilePage.js";
import movieDetails from "./routes/movieRoute.js";
import bookingsRouter from "./routes/bookings.js";


import bookings from "./routes/bookings.js";

import cors from "cors";

const app = express();
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
}));
      
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ 
        message: "Letterboxd Clone", 
        endpoints: {
            "/profile": "Profile routes",
            "/movies": "Movie routes"
        }
    });
});

// Import and use your routes here
app.use("/profile", profilePage);
app.use("/movies", movieDetails);

app.use("/", bookingsRouter);

app.use("/movies", bookings);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})
