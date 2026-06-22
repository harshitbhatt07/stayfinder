const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req,res,next)=>{
  try{
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.split(' ')[1] : null;
    if(!token) return res.status(401).json({message:'Not authorized'});
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'stayfinder_secret_key');
    req.user = await User.findById(decoded.id).select('-password');
    if(!req.user) return res.status(401).json({message:'User not found'});
    next();
  }catch(e){ res.status(401).json({message:'Invalid token'}); }
};
exports.allow = (...roles)=>(req,res,next)=>{
  if(!roles.includes(req.user.role)) return res.status(403).json({message:'Access denied'});
  next();
};
exports.ownerApproved = (req,res,next)=>{
  if(req.user.role === 'owner' && req.user.status !== 'approved') {
    return res.status(403).json({ message: 'Owner account is pending Super Admin approval' });
  }
  next();
};
