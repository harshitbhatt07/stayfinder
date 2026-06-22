const app = require('./app');
const connectDB = require('./config/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

async function createAdmin() {
  const email = 'admin@stayfinder.com';
  const exists = await User.findOne({ email });
  if (!exists) {
    const password = await bcrypt.hash('admin123', 10);
    await User.create({ name: 'Super Admin', email, phone: '0000000000', password, role: 'admin', status: 'approved' });
    console.log('Default admin created: admin@stayfinder.com / admin123');
  }
}

async function approveExistingOwners() {
  const result = await User.updateMany({ role: 'owner', status: 'pending' }, { $set: { status: 'approved' } });
  if (result.modifiedCount) console.log(`${result.modifiedCount} pending owner account(s) auto-approved`);
}

connectDB().then(async () => {
  await createAdmin();
  await approveExistingOwners();
  app.listen(PORT, () => console.log(`StayFinder backend running on port ${PORT}`));
});
