import Flat from "../models/flat.js";

export const searchFlats = async (req, res) => {
  const { location, price } = req.query;
  let query = {};
  if (location) query.location = { $regex: location, $options: "i" };
  if (price) query.price = { $lte: Number(price) };
  const flats = await Flat.find(query);
  res.json(flats);
};
