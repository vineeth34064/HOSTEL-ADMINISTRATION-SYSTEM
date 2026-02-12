import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from '../src/config/db.js';
import { User } from '../src/models/User.js';

const PASSWORD = 'password@123';
const SALT_ROUNDS = 10;

async function seedStudents() {
  try {
    await connectDB();
    const passwordHash = await bcrypt.hash(PASSWORD, SALT_ROUNDS);

    const branches = ['CS', 'ME', 'AI', 'EC'];
    const users = [];

    for (const branch of branches) {
      for (let i = 1; i <= 30; i++) {
        const number = i.toString().padStart(2, '0');
        const email = `123${branch}00${number}@iiitk.ac.in`;
        const existing = await User.findOne({ email });
        if (existing) continue;
        users.push({
          name: `Student ${email}`,
          email,
          passwordHash,
          role: 'student',
          rollNumber: email,
          feePaid: false,
        });
      }
    }

    if (users.length === 0) {
      console.log('No new students to insert. All accounts already exist.');
    } else {
      await User.insertMany(users);
      console.log(`Inserted ${users.length} student accounts.`);
    }
  } catch (err) {
    console.error('Error seeding students:', err);
  } finally {
    await mongoose.disconnect();
  }
}

seedStudents();
