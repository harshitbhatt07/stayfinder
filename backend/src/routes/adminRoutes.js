const router = require('express').Router();
const User = require('../models/User');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const { protect, allow } = require('../middleware/auth');
router.use(protect, allow('admin'));

router.get('/stats', async (req,res)=>{
  const [users, owners, rooms, bookings, pendingOwners, pendingBookings] = await Promise.all([
    User.countDocuments({role:'tourist'}), User.countDocuments({role:'owner'}), Room.countDocuments(), Booking.countDocuments(), User.countDocuments({role:'owner', status:'pending'}), Booking.countDocuments({status:'pending'})
  ]);
  const revenue = await Booking.aggregate([{ $match:{ status:{ $in:['confirmed','completed'] } } }, { $group:{ _id:null, total:{ $sum:'$amount' } } }]);
  res.json({users, owners, rooms, bookings, pendingOwners, pendingBookings, revenue: revenue[0]?.total || 0});
});
router.get('/owners', async (req,res)=>res.json(await User.find({role:'owner'}).select('-password').sort({createdAt:-1})));
router.patch('/owners/:id/status', async (req,res)=>res.json(await User.findByIdAndUpdate(req.params.id,{status:req.body.status},{new:true}).select('-password')));
router.get('/users', async (req,res)=>res.json(await User.find({role:'tourist'}).select('-password').sort({createdAt:-1})));
router.get('/rooms', async (req,res)=>res.json(await Room.find().populate('owner','name email businessName').sort({createdAt:-1})));
router.get('/bookings', async (req,res)=>res.json(await Booking.find().populate('room').populate('owner','name email').populate('tourist','name email phone').sort({createdAt:-1})));
module.exports = router;
