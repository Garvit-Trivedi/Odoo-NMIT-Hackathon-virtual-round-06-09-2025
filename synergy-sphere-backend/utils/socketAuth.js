import jwt from 'jsonwebtoken';

export const verifySocket = async (socket) => {
  const token = socket.handshake.auth?.token || (socket.handshake.headers?.authorization || '').split(' ')[1];
  if (!token) throw new Error('No token');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    return;
  } catch (err) {
    throw new Error('Invalid token');
  }
};