const router = require('express').Router();
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req,res)=>{
  const notifications = await Notification.find({ user:req.user._id }).sort({createdAt:-1}).limit(30);
  res.json(notifications);
});

router.patch('/:id/read', protect, async (req,res)=>{
  const notification = await Notification.findOneAndUpdate({ _id:req.params.id, user:req.user._id }, { isRead:true }, { new:true });
  if(!notification) return res.status(404).json({message:'Notification not found'});
  res.json(notification);
});

module.exports = router;
