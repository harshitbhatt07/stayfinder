const router = require('express').Router();
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Notification = require('../models/Notification');
const { protect, allow, ownerApproved } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', protect, allow('tourist'), upload.single('paymentScreenshot'), async (req,res)=>{
  const { roomId, checkIn, checkOut, guests, roomsCount, foodRequired, foodItems, specialRequest, paymentMethod } = req.body;
  const room = await Room.findById(roomId).populate('owner');
  if(!room || room.status !== 'available') return res.status(400).json({message:'Room not available'});

  const nights = Math.max(1, Math.ceil((new Date(checkOut)-new Date(checkIn))/(1000*60*60*24)) || 1);
  const roomQty = Math.max(1, Number(roomsCount) || 1);
  const foodList = foodItems ? foodItems.split(',').map(item=>item.trim()).filter(Boolean) : [];
  const amount = nights * room.price * roomQty;
  const screenshot = req.file ? `/uploads/${req.file.filename}` : '';

  const booking = await Booking.create({
    room:room._id,
    owner:room.owner._id,
    tourist:req.user._id,
    guestName:req.user.name,
    guestPhone:req.user.phone,
    guestEmail:req.user.email,
    checkIn,
    checkOut,
    guests:Number(guests)||1,
    roomsCount:roomQty,
    foodRequired: foodRequired === 'true' || foodRequired === true,
    foodItems: foodList,
    specialRequest,
    amount,
    paymentMethod,
    paymentStatus: paymentMethod === 'online' ? (screenshot ? 'verification_pending' : 'pending') : 'pending',
    paymentScreenshot:screenshot,
    status:'pending'
  });

  await Notification.create({
    user: room.owner._id,
    title: 'New booking request',
    message: `${req.user.name} booked ${room.title}. Please confirm or reject this booking.`,
    type: 'booking',
    booking: booking._id,
    room: room._id
  });

  res.status(201).json(booking);
});

router.get('/my', protect, allow('tourist'), async (req,res)=>{
  const bookings = await Booking.find({ tourist:req.user._id }).populate('room').populate('owner','name phone email businessName upiId qrImage').sort({createdAt:-1});
  res.json(bookings);
});
router.get('/owner', protect, allow('owner'), ownerApproved, async (req,res)=>{
  const bookings = await Booking.find({ owner:req.user._id }).populate('room').populate('tourist','name email phone').sort({createdAt:-1});
  res.json(bookings);
});
router.patch('/:id/owner-action', protect, allow('owner'), ownerApproved, async (req,res)=>{
  const booking = await Booking.findOne({ _id:req.params.id, owner:req.user._id }).populate('room tourist');
  if(!booking) return res.status(404).json({message:'Booking not found'});
  const { action } = req.body;
  if(action === 'confirm') {
    booking.status='confirmed';
    booking.paymentStatus = booking.paymentMethod === 'online' ? 'paid' : booking.paymentStatus;
    await Room.findByIdAndUpdate(booking.room._id, { status:'booked' });
    await Notification.create({ user: booking.tourist._id, title:'Booking confirmed', message:`Your booking for ${booking.room.title} has been accepted by the owner.`, type:'success', booking:booking._id, room:booking.room._id });
  }
  if(action === 'reject') {
    booking.status='rejected';
    await Notification.create({ user: booking.tourist._id, title:'Booking rejected', message:`Your booking for ${booking.room.title} has been rejected by the owner.`, type:'error', booking:booking._id, room:booking.room._id });
  }
  if(action === 'complete') booking.status='completed';
  await booking.save();
  res.json(booking);
});
router.patch('/:id/cancel', protect, async (req,res)=>{
  const booking = await Booking.findOne({ _id:req.params.id, tourist:req.user._id });
  if(!booking) return res.status(404).json({message:'Booking not found'});
  booking.status='cancelled';
  await Room.findByIdAndUpdate(booking.room, { status:'available' });
  await booking.save();
  res.json(booking);
});
module.exports = router;
