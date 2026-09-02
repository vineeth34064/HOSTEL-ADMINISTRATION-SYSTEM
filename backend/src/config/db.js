import mongoose from 'mongoose';

import { MongoMemoryServer } from 'mongodb-memory-server';

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hostel_management';
  console.log(`Connecting to MongoDB at ${uri}...`);
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB connected successfully');
    await seedAdmin();
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    
    // Attempt in-memory fallback only in non-production environments
    if (process.env.NODE_ENV !== 'production') {
      try {
        console.log('Attempting in-memory MongoDB fallback...');
        const mongoServer = await MongoMemoryServer.create();
        const memUri = mongoServer.getUri();
        await mongoose.connect(memUri);
        console.log('In-memory MongoDB started and connected successfully');
        await seedAdmin();
        return;
      } catch (memErr) {
        console.error('In-memory MongoDB fallback unavailable:', memErr.message);
      }
    }
    console.warn('⚠️ Server running without active MongoDB connection. Please verify MONGODB_URI & Atlas credentials.');
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
