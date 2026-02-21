import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

export function createToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
}

export async function authRequired(req, res, next) {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).send('Not authenticated');
    }
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(401).send('User not found');
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).send('Invalid token');
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).send('Forbidden');
    }
    next();
  };
}
