const mongoose = require('mongoose');
const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, default: 'info' },
  isRead: { type: Boolean, default: false },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' }
}, { timestamps: true });
module.exports = mongoose.model('Notification', notificationSchema);
