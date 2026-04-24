// src/utils/generatePassword.js
const crypto = require('crypto');

// Generate random password
const generateRandomPassword = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Generate temporary password (easy to read)
const generateTempPassword = () => {
  const adjectives = ['Happy', 'Strong', 'Smart', 'Brave', 'Calm', 'Wise'];
  const nouns = ['Doctor', 'Health', 'Care', 'Smile', 'Heart', 'Life'];
  const numbers = Math.floor(Math.random() * 900 + 100);
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  
  return `${adjective}${noun}@${numbers}`;
};

// Generate user ID
const generateUserId = (name, role) => {
  const prefix = role === 'doctor' ? 'DOC' : role === 'patient' ? 'PAT' : 'ADM';
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const namePrefix = name.substring(0, 3).toUpperCase();
  return `${prefix}${namePrefix}${randomNum}`;
};

module.exports = {
  generateRandomPassword,
  generateTempPassword,
  generateUserId
};