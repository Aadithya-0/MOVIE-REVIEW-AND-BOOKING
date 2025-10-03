import express from 'express';
import movieController from '../Controller/movieController.js';

const router = express.Router();

router.get('/:id', movieController.getMovieById);

export default router;