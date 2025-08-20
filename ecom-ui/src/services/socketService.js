import { io } from 'socket.io-client';

let socket = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

export const initSocket = () => {
  const user = JSON.parse(localStorage.getItem('alfauser'));
  
  if (!user || !user.token) {
    console.error('🚫 Cannot initialize socket: user not authenticated');
    return null;
  }
  
  // Always create a new socket connection to avoid stale connections
  if (socket) {
    console.log('🔄 Disconnecting existing socket before creating new one');
    socket.disconnect();
    socket = null;
  }
  
  // Make sure we're using the correct URL - strip /api if present
  let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
  if (API_URL.endsWith('/api')) {
    API_URL = API_URL.substring(0, API_URL.length - 4);
  }
  
  console.log('🔌 Initializing new socket connection to:', API_URL);
  
  socket = io(API_URL, {
    auth: {
      token: user.token
    },
    reconnection: true,
    reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
    transports: ['websocket', 'polling'],
    forceNew: true,
    withCredentials: true,
    extraHeaders: {
      "Authorization": `Bearer ${user.token}`
    }
  });
  
  socket.on('connect', () => {
    console.log('✅ Socket connected successfully with ID:', socket.id);
    console.log('👤 User:', user.name, 'ID:', user._id);
    reconnectAttempts = 0;
  });
  
  socket.on('connect_error', (err) => {
    console.error('❌ Socket connection error:', err.message);
    reconnectAttempts++;
    
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.error(`💥 Failed to connect after ${MAX_RECONNECT_ATTEMPTS} attempts`);
    }
  });
  
  socket.on('error', (err) => {
    console.error('⚠️ Socket error:', err);
  });
  
  socket.on('disconnect', (reason) => {
    console.log('🔌 Socket disconnected:', reason);
  });

  // Add heartbeat mechanism
  socket.on('ping', () => {
    socket.emit('pong');
  });
  
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    console.log('🔄 Manually disconnecting socket');
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => {
  const user = JSON.parse(localStorage.getItem('alfauser'));
  
  if (!user || !user.token) {
    console.warn('🚫 User not authenticated, cannot get socket');
    return null;
  }
  
  if (!socket || !socket.connected) {
    console.log('🔄 Socket not available or disconnected, initializing new connection');
    return initSocket();
  }
  
  console.log('✅ Returning existing connected socket');
  return socket;
};

// Test if the socket is connected
export const isSocketConnected = () => {
  return socket && socket.connected;
};