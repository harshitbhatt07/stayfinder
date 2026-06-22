const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/token');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/register-tourist', async (req,res)=>{
  const { name,email,phone,password } = req.body;
  if(await User.findOne({email})) return res.status(400).json({message:'Email already registered'});
  const hash = await bcrypt.hash(password,10);
  const user = await User.create({ name,email,phone,password:hash,role:'tourist',status:'active' });
  res.status(201).json({ user:{id:user._id,name:user.name,email:user.email,phone:user.phone,role:user.role,status:user.status,businessName:user.businessName,qrImage:user.qrImage}, token: generateToken(user._id) });
});

router.post('/register-owner', upload.single('qrImage'), async (req,res)=>{
  const { name,email,phone,password,businessName,city,state,address,panNumber,upiId } = req.body;
  if(await User.findOne({email})) return res.status(400).json({message:'Email already registered'});
  const hash = await bcrypt.hash(password,10);
  const qrImage = req.file ? `/uploads/${req.file.filename}` : '';
  const user = await User.create({ name,email,phone,password:hash,role:'owner',status:'pending',businessName,city,state,address,panNumber,upiId,qrImage });
  res.status(201).json({ message:'Owner registration submitted successfully. Please wait for Super Admin approval before login.', user:{id:user._id,name:user.name,email:user.email,role:user.role,status:user.status} });
});

router.post('/login', async (req,res)=>{
  const { email,password,role } = req.body;
  const user = await User.findOne({email});
  if(!user || !(await bcrypt.compare(password, user.password))) return res.status(400).json({message:'Invalid email or password'});
  if(role && user.role !== role) return res.status(400).json({message:`This account is not ${role}`});
  if(user.role === 'owner' && user.status !== 'approved') {
    const msg = user.status === 'pending'
      ? 'Your owner account is pending Super Admin approval. Please wait until admin approves your account.'
      : user.status === 'rejected'
        ? 'Your owner account has been rejected by Super Admin.'
        : 'Your owner account is blocked. Please contact admin.';
    return res.status(403).json({ message: msg });
  }
  if(user.status === 'blocked') return res.status(403).json({message:'Your account is blocked. Please contact admin.'});
  res.json({ user:{id:user._id,name:user.name,email:user.email,phone:user.phone,role:user.role,status:user.status,qrImage:user.qrImage,businessName:user.businessName}, token: generateToken(user._id) });
});

router.get('/me', protect, (req,res)=>res.json(req.user));
module.exports = router;
