const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tourist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  guestName: String,
  guestPhone: String,
  guestEmail: String,
  checkIn: Date,
  checkOut: Date,
  guests: { type: Number, default: 1 },
  roomsCount: { type: Number, default: 1 },
  foodRequired: { type: Boolean, default: false },
  foodItems: [String],
  specialRequest: String,
  amount: Number,
  paymentMethod: { type: String, enum: ['cash','online'], default: 'cash' },
  paymentStatus: { type: String, enum: ['pending','paid','verification_pending'], default: 'pending' },
  paymentScreenshot: String,
  status: { type: String, enum: ['pending','confirmed','rejected','cancelled','completed'], default: 'pending' }
}, { timestamps: true });
module.exports = mongoose.model('Booking', bookingSchema);
