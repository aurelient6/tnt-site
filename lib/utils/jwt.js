import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'CHANGEZ_CETTE_CLE_MAINTENANT';
const JWT_EXPIRATION = '24h';

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.warn('⚠️ ATTENTION: JWT_SECRET non défini en production !');
}

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: JWT_EXPIRATION,
    issuer: 'tnt-site',
    audience: 'admin'
  });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'tnt-site',
      audience: 'admin'
    });
  } catch (error) {
    return null;
  }
}
