import mongoose from 'mongoose';

import { MongoMemoryServer } from 'mongodb-memory-server';

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hostel_management';
  console.log(`Connecting to MongoDB at ${uri}...`);
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB connected successfully to', uri);
    await seedAdmin();
  } catch (err) {
    console.error('MongoDB connection error. Falling back to in-memory database:', err.message);
    try {
      const mongoServer = await MongoMemoryServer.create();
      const memUri = mongoServer.getUri();
      await mongoose.connect(memUri);
      console.log('In-memory MongoDB started and connected successfully');
      await seedAdmin();
    } catch (memErr) {
      console.error('Failed to start in-memory database fallback:', memErr);
      process.exit(1);
    }
  }
}

async function seedAdmin() {
  try {
    const { User } = await import('../models/User.js');
    const { default: bcrypt } = await import('bcryptjs');
    const adminEmail = 'admin@iiitk.ac.in';
    const existing = await User.findOne({ email: adminEmail });
    if (!existing) {
      await User.create({
        name: 'System Admin',
        email: adminEmail,
        passwordHash: await bcrypt.hash('adminpassword', 10),
        role: 'admin',
        rollNumber: 'ADMIN001',
        feePaid: true,
      });
      console.log('Default admin seeded: admin@iiitk.ac.in / adminpassword');
    }
  } catch (e) {
    console.error('Admin seeding skipped or failed:', e.message);
  }
}
