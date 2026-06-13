const mongoose = require('mongoose');
const URLModel = require('./models/URL');
require('dotenv').config({ path: './.env' });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smartlink');
  
  // Find any user
  const User = require('./models/User');
  const user = await User.findOne();
  if(!user) {
    console.log("No user found");
    process.exit(1);
  }
  
  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 1);

  // Clean up if already exists
  await URLModel.deleteOne({ shortCode: 'expired34' });

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
