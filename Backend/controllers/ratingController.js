const { getRatingsForOwner, getAverageRatingForOwner, rateStore } = require('../models/ratingModel');
const Joi = require('joi');

const ratingSchema = Joi.object({
  store_id: Joi.number().required(),
  rating: Joi.number().min(1).max(5).required(),
});




exports.ownerDashboard = async (req, res) => {
  try {
    // Only allow store_owner role (enforced by middleware)
    const owner_id = req.user.id;
    const userRatings = await getRatingsForOwner(owner_id);
    const avgRatings = await getAverageRatingForOwner(owner_id);
    res.json({
      ratings: userRatings,
      storeAverages: avgRatings
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




exports.submitRating = async (req, res) => {
  const { error } = ratingSchema.validate(req.body);
  if (error) {
    console.log(error.message);
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const rating = await rateStore({
      user_id: req.user.id,
      store_id: req.body.store_id,
      rating: req.body.rating,
    });
    res.json({ rating });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
