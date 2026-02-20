import { Message } from '../models/Message.js';
import { User } from '../models/User.js';

export async function searchUsers(req, res) {
  try {
    const { query } = req.query;
    const users = await User.find({
      $and: [
        { _id: { $ne: req.user._id } }, // exclude current user
        query ? {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } },
            { rollNumber: { $regex: query, $options: 'i' } }
          ]
        } : {} // if no query, return some users
      ]
    }).limit(20);
    
    res.json(users.map(u => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      role: u.role,
      rollNumber: u.rollNumber
    })));
  } catch (err) {
    console.error(err);
    res.status(500).send('Search failed');
  }
}

export async function getMessages(req, res) {
  try {
    const { userId } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id }
      ]
    }).sort({ createdAt: 1 });
    
    res.json(messages.map(m => ({
      id: m._id.toString(),
      sender: m.sender.toString(),
      receiver: m.receiver.toString(),
      content: m.content,
      createdAt: m.createdAt,
      read: m.read
    })));
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch messages');
  }
}

export async function sendMessage(req, res) {
  try {
    const { receiver, content } = req.body;
    if (!receiver || !content) {
      return res.status(400).send('Missing receiver or content');
    }
    
    const message = await Message.create({
      sender: req.user._id,
      receiver,
      content
    });
    
    res.json({
      id: message._id.toString(),
      sender: message.sender.toString(),
      receiver: message.receiver.toString(),
      content: message.content,
      createdAt: message.createdAt
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to send message');
  }
}

export async function getRecentChats(req, res) {
  try {
    // This is a simple implementation: find all unique users the current user has chatted with
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }]
    }).sort({ createdAt: -1 });
    
    const userIds = new Set();
    messages.forEach(m => {
      const otherId = m.sender.toString() === req.user._id.toString() ? m.receiver.toString() : m.sender.toString();
      userIds.add(otherId);
    });
    
    const users = await User.find({ _id: { $in: Array.from(userIds) } });
    res.json(users.map(u => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      role: u.role
    })));
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch chats');
  }
}
