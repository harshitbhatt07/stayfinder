const mongoose = require('mongoose');
require('dotenv').config();
module.exports = async function connectDB(){
  try{
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/stayfinder');
    console.log('MongoDB connected');
  }catch(err){
    console.error('MongoDB error:', err.message);
    process.exit(1);
  }
}
