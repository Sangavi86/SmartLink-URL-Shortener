const mongoose = require('mongoose');
const URLModel = require('./server/models/URL');
require('dotenv').config({ path: './server/.env' });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  // Find any user
  const User = require('./server/models/User');
  const user = await User.findOne();
  
  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 1);

  // Create expired URL
  const expiredUrl = await URLModel.create({
    userId: user._id,
    originalUrl: 'https://expired-test.com',
    shortCode: 'expired34',
    expiryDate: pastDate
  });

  console.log('Created expired URL with shortCode: ' + expiredUrl.shortCode);
  
  process.exit(0);
}
run();
