const mongoose = require('mongoose');
const roomSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  propertyName: String,
  category: { type: String, enum: ['Hotel','Homestay','Resort','Villa','Mountain View','Lake View','Beach Side'], default: 'Hotel' },
  description: String,
  price: { type: Number, required: true },
  city: { type: String, required: true },
  state: String,
  address: String,
  amenities: [String],
  rating: { type: Number, default: 4.5 },
  images: [String],
  status: { type: String, enum: ['available','booked','inactive'], default: 'available' },
  isApproved: { type: Boolean, default: true }
}, { timestamps: true });
module.exports = mongoose.model('Room', roomSchema);
