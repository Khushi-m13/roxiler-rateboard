import { createRating, updateRating } from '../services/rating.service.js';
import { validateRating } from '../validators/index.js';

export async function postRating(req, res, next) {
  try {
    const storeId = Number(req.body.storeId);
    const rating = Number(req.body.rating);

    if (!Number.isInteger(storeId) || storeId <= 0) {
      return res.status(400).json({ message: 'A valid store is required.' });
    }

    if (!validateRating(rating)) {
      return res.status(400).json({ message: 'Rating must be an integer from 1 to 5.' });
    }

    const result = await createRating(req.user.id, storeId, rating);

    if (result.error === 'STORE_NOT_FOUND') {
      return res.status(404).json({ message: 'Store not found.' });
    }

    if (result.error === 'DUPLICATE') {
      return res.status(409).json({ message: 'You have already rated this store. Update your existing rating instead.' });
    }

    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
}

export async function putRating(req, res, next) {
  try {
    const ratingId = Number(req.params.id);
    const rating = Number(req.body.rating);

    if (!Number.isInteger(ratingId) || ratingId <= 0) {
      return res.status(400).json({ message: 'Invalid rating.' });
    }

    if (!validateRating(rating)) {
      return res.status(400).json({ message: 'Rating must be an integer from 1 to 5.' });
    }

    const result = await updateRating(req.user.id, ratingId, rating);

    if (result.error === 'NOT_ALLOWED') {
      return res.status(403).json({ message: 'You can only modify your own rating.' });
    }

    return res.json(result);
  } catch (error) {
    return next(error);
  }
}
