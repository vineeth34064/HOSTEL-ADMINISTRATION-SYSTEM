import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { HealthRecord } from '../models/HealthRecord.js';
import { createToken } from '../middleware/auth.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const SALT_ROUNDS = 10;

export async function register(req, res) {
  try {
    const { name, password, rollNumber, contactNumber } = req.body;
    const email = req.body.email?.toLowerCase();
    
    if (!name || !email || !password) {
      return res.status(400).send('Missing required fields');
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).send('Email already registered');
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ name, email, passwordHash, role: 'student', rollNumber, contactNumber, feePaid: false });

    // Auto-create a realistic dummy health record for the new student.
    try {
      const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
      const randomBlood = bloodGroups[Math.floor(Math.random() * bloodGroups.length)];
      const randomHeight = Math.floor(Math.random() * 31) + 155; // 155–185 cm
      const randomWeight = Math.floor(Math.random() * 36) + 50;  // 50–85 kg

      const sampleAllergies = [
        ['Dust', 'Pollen'],
        ['Peanuts'],
        ['Penicillin', 'Shellfish'],
        [],
        ['Latex'],
        ['None reported'],
      ];
      const sampleMedications = [
        ['Vitamin D3 – 1000 IU daily'],
        ['Cetirizine 10mg – as needed'],
        [],
        ['Iron supplement – once daily'],
        ['Multivitamin – once daily'],
      ];
      const sampleConditions = [
        [], [], [],
        ['Mild asthma'],
        ['Seasonal rhinitis'],
      ];
      const sampleHistory = [
        'No significant medical history.',
        'Recovered from typhoid in 2022. No current complications.',
        'Underwent appendectomy in 2021. Fully recovered.',
        'History of seasonal allergies. Managed with antihistamines.',
        'No known chronic illnesses or prior surgeries.',
      ];
      const sampleDoctors = [
        { name: 'Dr. Ravi Shankar', hospital: 'Apollo Hospital, Hyderabad', phone: '+91-40-23607777' },
        { name: 'Dr. Priya Menon', hospital: 'KIMS Hospital, Secunderabad', phone: '+91-40-44885000' },
        { name: 'Dr. Anil Kumar', hospital: 'Yashoda Hospital, Somajiguda', phone: '+91-40-45674567' },
        { name: 'Dr. Sunita Reddy', hospital: 'Care Hospital, Banjara Hills', phone: '+91-40-30418000' },
      ];
      const sampleInsurance = [
        { providerName: 'Star Health Insurance', policyNumber: `SHI-${Math.floor(100000 + Math.random() * 900000)}` },
        { providerName: 'HDFC ERGO Health', policyNumber: `HEH-${Math.floor(100000 + Math.random() * 900000)}` },
        { providerName: 'New India Assurance', policyNumber: `NIA-${Math.floor(100000 + Math.random() * 900000)}` },
        { providerName: 'Bajaj Allianz Health', policyNumber: `BAH-${Math.floor(100000 + Math.random() * 900000)}` },
      ];
      const sampleContacts = [
        { name: 'Rajesh Kumar', relation: 'Father', phone: '+91-98765-43210' },
        { name: 'Sunita Devi', relation: 'Mother', phone: '+91-91234-56789' },
        { name: 'Anita Singh', relation: 'Guardian', phone: '+91-99887-76655' },
        { name: 'Mohan Lal', relation: 'Father', phone: '+91-88776-65544' },
      ];

      const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

      const pastDate = new Date();
      pastDate.setMonth(pastDate.getMonth() - Math.floor(Math.random() * 10 + 1));

      await HealthRecord.create({
        student: user._id,
        studentName: user.name,
        bloodGroup: randomBlood,
        heightCm: randomHeight,
        weightKg: randomWeight,
        allergies: pick(sampleAllergies),
        existingMedicalConditions: pick(sampleConditions),
        currentMedications: pick(sampleMedications),
        recentIllnesses: [],
        medicalHistory: pick(sampleHistory),
        disabilityInfo: 'None',
        emergencyContact: pick(sampleContacts),
        doctorDetails: pick(sampleDoctors),
        healthInsuranceDetails: pick(sampleInsurance),
        lastMedicalCheckup: pastDate,
      });
    } catch (e) {
      console.error('Failed to create health record:', e.message);
    }

    const token = createToken(user);
    const isProduction = process.env.NODE_ENV === 'production';
    res
      .cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: isProduction,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json(mapUser(user));
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).send('Failed to register');
  }
}

export async function login(req, res) {
  try {
    const email = req.body.email?.toLowerCase();
    const { password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('Invalid email or password');
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(400).send('Invalid email or password');
    }

    const token = createToken(user);
    const isProduction = process.env.NODE_ENV === 'production';
    res
      .cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: isProduction,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json(mapUser(user));
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to login');
  }
}

export async function logout(req, res) {
  res.clearCookie('token').status(204).send();
}

export async function session(req, res) {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(200).json(null);
    }
    const jwt = await import('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
    const payload = jwt.default.verify(token, JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(200).json(null);
    }
    res.json(mapUser(user));
  } catch {
    return res.status(200).json(null);
  }
}

function mapUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    passwordHash: user.passwordHash,
    role: user.role,
    rollNumber: user.rollNumber,
    feePaid: user.feePaid,
    contactNumber: user.contactNumber,
  };
}

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      // Don't leak whether the email exists or not, always send success message
      return res.status(200).json({ message: 'If that email is registered, a reset link has been sent.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hash = await bcrypt.hash(resetToken, 10);

    user.resetPasswordToken = hash;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}?email=${encodeURIComponent(email)}`;

    let transporter;
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        service: 'gmail', // Usually you use Gmail
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Fallback: Create a test account for Nodemailer if you don't have real SMTP credentials
      let testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user, // generated ethereal user
          pass: testAccount.pass, // generated ethereal password
        },
      });
    }

    const mailOptions = {
        from: '"IIIT HMS" <noreply@iiit.ac.in>',
        to: email,
        subject: 'Password Reset Request',
        text: `You requested a password reset. Click this link: ${resetUrl}`,
        html: `
            <p>You requested a password reset.</p>
            <p>Click this link to reset your password:</p>
            <a href="${resetUrl}">${resetUrl}</a>
            <p>If you didn't request this, you can ignore this email.</p>
        `,
    };

    let info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent: %s", info.messageId);
    
    if (!process.env.SMTP_USER) {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      // Inform the user in the logs
      console.log(`\n========================================================================`);
      console.log(`PASSWORD RESET LINK FOR ${email}:`);
      console.log(`${resetUrl}`);
      console.log(`========================================================================\n`);
    }

    res.status(200).json({ 
        message: process.env.SMTP_USER ? 'Password reset link has been sent to your email.' : 'Password reset link has been generated. Check console if testing locally.' 
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
}

export async function resetPassword(req, res) {
  try {
    const { email, token, newPassword } = req.body;
    
    if (!email || !token || !newPassword) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const user = await User.findOne({ 
      email,
      resetPasswordExpires: { $gt: Date.now() } 
    });

    if (!user || !user.resetPasswordToken) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    const isValid = await bcrypt.compare(token, user.resetPasswordToken);
    
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Hash the new password
    user.passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    
    // Clear the reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
}
