import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../src/models/User.js';

const SOURCE_URI = 'mongodb://localhost:27017/HOSTEL_DATA';
const TARGET_URI = 'mongodb://localhost:27017/hostel_management';
const SALT_ROUNDS = 10;

async function migrateAndHash() {
  try {
    console.log('Connecting to databases...');
    const sourceConn = await mongoose.createConnection(SOURCE_URI).asPromise();
    const targetConn = await mongoose.connect(TARGET_URI);

    const sourceCollection = sourceConn.db.collection('HOSTEL');
    const rawStudents = await sourceCollection.find().toArray();
    console.log(`Found ${rawStudents.length} students in source collection.`);

    let migratedCount = 0;
    let skippedCount = 0;

    for (const student of rawStudents) {
      const email = student['Email Address'];
      if (!email) {
        console.warn('Skipping student with no Email Address:', student);
        skippedCount++;
        continue;
      }

      const existing = await User.findOne({ email });
      if (existing) {
        console.log(`User ${email} already exists in target DB. Skipping.`);
        skippedCount++;
        continue;
      }

      const plainPassword = student['Password'] || 'password@123'; 
      console.log(`Hashing password for ${email}...`);
      const passwordHash = await bcrypt.hash(plainPassword, SALT_ROUNDS);

      await User.create({
        name: student['Full Name'] || 'Unknown Student',
        email,
        passwordHash,
        role: 'student',
        rollNumber: student['Roll Number'] || email,
        contactNumber: student['Phone Number'] || '',
        feePaid: false,
      });

      migratedCount++;
    }

    console.log('\nMigration Complete!');
    console.log(`Total students processed: ${rawStudents.length}`);
    console.log(`New students migrated: ${migratedCount}`);
    console.log(`Students skipped/existing: ${skippedCount}`);

    await sourceConn.close();
    await mongoose.disconnect();
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrateAndHash();
