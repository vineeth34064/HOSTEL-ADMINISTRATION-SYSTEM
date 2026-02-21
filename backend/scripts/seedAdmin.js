import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from '../src/config/db.js';
import { User } from '../src/models/User.js';

const PASSWORD = 'adminpassword';
const SALT_ROUNDS = 10;

async function seedAdmin() {
  try {
    await connectDB();
    const passwordHash = await bcrypt.hash(PASSWORD, SALT_ROUNDS);

    const email = 'admin@iiitk.ac.in';
    const existing = await User.findOne({ email });
    
    if (existing) {
      existing.role = 'admin';
      existing.passwordHash = passwordHash;
      await existing.save();
      console.log('Admin user updated.');
    } else {
      await User.create({
        name: 'System Admin',
        email,
        passwordHash,
        role: 'admin',
        rollNumber: 'ADMIN001',
        feePaid: true,
      });
      console.log('Admin user created: admin@iiitk.ac.in / adminpassword');
    }
  } catch (err) {
    console.error('Error seeding admin:', err);
  } finally {
    await mongoose.disconnect();
  }
}

seedAdmin();
