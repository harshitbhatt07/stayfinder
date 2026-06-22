const router = require('express').Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');
router.put('/profile', protect, async (req,res)=>{
  const allowed = ['name','phone','city','state','address'];
  const data = {};
  allowed.forEach(k=>{ if(req.body[k] !== undefined) data[k]=req.body[k]; });
  const user = await User.findByIdAndUpdate(req.user._id, data, {new:true}).select('-password');
  res.json(user);
});
module.exports = router;
