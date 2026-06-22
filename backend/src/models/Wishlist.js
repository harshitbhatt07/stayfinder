const mongoose = require('mongoose');
const wishlistSchema = new mongoose.Schema({ user:{type:mongoose.Schema.Types.ObjectId, ref:'User'}, room:{type:mongoose.Schema.Types.ObjectId, ref:'Room'} }, {timestamps:true});
module.exports = mongoose.model('Wishlist', wishlistSchema);
