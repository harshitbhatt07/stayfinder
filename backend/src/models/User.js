const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['tourist','owner','admin'], default: 'tourist' },
  status: { type: String, enum: ['active','pending','approved','rejected','blocked'], default: 'active' },
  businessName: String,
  city: String,
  state: String,
  address: String,
  panNumber: String,
  upiId: String,
  qrImage: String,
  avatar: String
}, { timestamps: true });
module.exports = mongoose.model('User', userSchema);
