import React, { useState, useEffect, useRef } from 'react';
import { getMessages, sendMessage, deleteMessage } from '../services/chatService.js';
import { getSocket } from '../services/socketService.js';
import { formatDistanceToNow } from 'date-fns';
import { BsTrash } from 'react-icons/bs';

// Add debounce function at the top of your file
const debounce = (func, delay) => {
  let timeoutId;
  return function(...args) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

const ChatMessages = ({ conversation, onImageClick }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  // Handler for deleting a message (admin only)
  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await deleteMessage(messageId);
      setMessages(prev => prev.filter(msg => msg._id !== messageId));
    } catch (err) {
      alert('Failed to delete message.');
    }
  };
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem('alfauser'));
  const isTypingRef = useRef(false);
  const lastMessageIdRef = useRef(null);
  // Create debounced stop typing function
  const debouncedStopTyping = useRef(
    debounce(() => {
      const socket = getSocket();
      if (socket && conversation && isTypingRef.current) {
        const recipientId = conversation.participants.find(
          p => p._id !== currentUser._id
        )?._id;
        
        if (recipientId) {
          socket.emit('stop_typing', {
            conversationId: conversation._id,
            recipientId
          });
          isTypingRef.current = false;
        }
      }
    }, 2000)
  ).current;

  useEffect(() => {
    if (!conversation) return;
    
    console.log('🔄 Loading conversation:', conversation._id);
    
    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMessages(conversation._id);
        setMessages(data);
        if (data.length > 0) {
          lastMessageIdRef.current = data[data.length - 1]._id;
        }
      } catch (err) {
        console.error('❌ Error fetching messages:', err);
        setError('Failed to load messages. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    
    // Get socket connection
    const socket = getSocket();
    if (!socket) {
      setSocketConnected(false);
      return;
    }

    setSocketConnected(socket.connected);

    // Handle connection events
    const handleConnect = () => {
      console.log('✅ Socket connected');
      setSocketConnected(true);
    };

    const handleDisconnect = () => {
      console.log('❌ Socket disconnected');
      setSocketConnected(false);
    };

    // Handle new messages - simplified and optimized
    const handleNewMessage = (data) => {
      console.log('📨 New message received:', data);
      
      // Only process messages for current conversation
      if (data.conversationId === conversation._id) {
        // Prevent duplicate by checking last message ID
        if (data._id === lastMessageIdRef.current) {
          console.log('⚠️ Duplicate message detected, skipping');
          return;
        }

        const newMessage = {
          _id: data._id,
          content: data.content,
          sender: data.sender || {
            _id: data.senderId,
            name: conversation.participants.find(p => p._id === data.senderId)?.name || 'User',
            profile: conversation.participants.find(p => p._id === data.senderId)?.profile
          },
          createdAt: data.createdAt || new Date().toISOString()
        };

        setMessages(prevMessages => {
          // Check for duplicates
          const exists = prevMessages.some(msg => msg._id === newMessage._id);
          if (exists) return prevMessages;
          
          const updated = [...prevMessages, newMessage];
          lastMessageIdRef.current = newMessage._id;
          return updated;
        });

        // Play notification sound for incoming messages
        if (data.senderId !== currentUser._id) {
          try {
            const audio = new Audio('data:audio/wav;base64,UklGRvIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU4AAABBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBziR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmDwcPr+sY4JDPV58Lh8yQTOdvjB');
            audio.volume = 0.2;
            audio.play().catch(() => {});
          } catch (e) {}
        }
      }
    };

    // Handle typing indicators
    const handleTyping = (data) => {
      if (data.conversationId === conversation._id && data.userId !== currentUser._id) {
        setIsTyping(true);
      }
    };

    const handleStopTyping = (data) => {
      if (data.conversationId === conversation._id && data.userId !== currentUser._id) {
        setIsTyping(false);
      }
    };

    // Attach event listeners
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('new_message', handleNewMessage);
    socket.on('typing', handleTyping);
    socket.on('stop_typing', handleStopTyping);
    
    // Cleanup
    return () => {
      if (socket) {
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
        socket.off('new_message', handleNewMessage);
        socket.off('typing', handleTyping);
        socket.off('stop_typing', handleStopTyping);
      }
    };
  }, [conversation?._id, currentUser._id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && !imageFile) || loading) return;
    const messageToSend = newMessage.trim();
    const recipientId = conversation.participants.find(
      p => p._id !== currentUser._id
    )._id;
    let imageBase64 = null;
    if (imageFile) {
      imageBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });
    }
    try {
      setLoading(true);
      setNewMessage('');
      setImageFile(null);
      setImagePreview(null);
      // Send message via API
      const sentMessage = await sendMessage(conversation._id, messageToSend, imageBase64);
      // Add to local state immediately
      setMessages(prev => {
        const exists = prev.some(msg => msg._id === sentMessage._id);
        if (exists) return prev;
        const updated = [...prev, sentMessage];
        lastMessageIdRef.current = sentMessage._id;
        return updated;
      });
      // Send via socket for real-time delivery to other users
      const socket = getSocket();
      if (socket && socket.connected) {
        socket.emit('send_message', {
          conversationId: conversation._id,
          recipientId,
          content: messageToSend,
          imageUrl: sentMessage.imageUrl,
          _id: sentMessage._id,
          senderId: currentUser._id,
          createdAt: sentMessage.createdAt,
          sender: sentMessage.sender
        });
      }
    } catch (err) {
      console.error('❌ Failed to send message:', err);
      setNewMessage(messageToSend);
      setImageFile(imageFile);
      setImagePreview(imagePreview);
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    
    // Handle typing indicator
    const socket = getSocket();
    if (socket && conversation) {
      const recipientId = conversation.participants.find(
        p => p._id !== currentUser._id
      )?._id;
      
      if (recipientId && !isTypingRef.current) {
        socket.emit('typing', {
          conversationId: conversation._id,
          recipientId
        });
        isTypingRef.current = true;
      }
      
      // Reset the debounce timer
      debouncedStopTyping();
    }
  };

  if (!conversation) {
    return (
      <div className="d-flex align-items-center justify-content-center h-100">
        <p className="text-muted">
          Select a conversation to start chatting
        </p>
      </div>
    );
  }
  
  if (!conversation.participants || conversation.participants.length < 2) {
    console.error('Invalid conversation format:', conversation);
    return (
      <div className="d-flex align-items-center justify-content-center h-100">
        <p className="text-muted">
          This conversation doesn't have all required participants. Try refreshing.
        </p>
      </div>
    );
  }

  const otherUser = conversation.participants.find(
    p => p._id !== currentUser._id
  );
  
  if (!otherUser) {
    console.error('Could not find other participant in conversation:', conversation);
    return (
      <div className="d-flex align-items-center justify-content-center h-100">
        <p className="text-muted">
          Could not identify the other participant in this conversation. Try refreshing.
        </p>
      </div>
    );
  }

  return (
    <div className="chat-container d-flex flex-column h-100">
      {/* Chat header */}
      <div className="chat-header p-3 border-bottom">
        <div className="d-flex align-items-center">
          <div className="flex-shrink-0">
            {otherUser.profile ? (
              <img 
                src={otherUser.profile} 
                alt={otherUser.name} 
                className="rounded-circle"
                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
              />
            ) : (
              <div 
                className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
                style={{ width: '40px', height: '40px' }}
              >
                {otherUser.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="ms-3">
            <h6 className="mb-0">{otherUser.name == "Admin" ? 'Customer Support' : otherUser?.name}</h6>
            {/* {otherUser.shopName && (
              <small className="text-muted">{otherUser.shopName}</small>
            )} */}
          </div>
          <div className="ms-auto">
            <div className="d-flex align-items-center">
              <div 
                className="me-2"
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: socketConnected ? '#28a745' : '#dc3545'
                }}
              ></div>
              <small className={socketConnected ? 'text-success' : 'text-danger'}>
                {socketConnected ? 'Online' : 'Offline'}
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="chat-messages flex-grow-1 p-3 overflow-auto" style={{ maxHeight: '500px' }}>
        {loading ? (
          <div className="d-flex justify-content-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-4 text-muted">
            No messages yet. Start a conversation!
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              const isCurrentUser = message.sender._id === currentUser._id;
              
              return (
                <div
                  key={message._id || index}
                  className={`message d-flex mb-3 ${isCurrentUser ? 'justify-content-end' : ''}`}
                >
                  {!isCurrentUser && (
                    <div className="flex-shrink-0 me-2">
                      {message.sender.profile ? (
                        <img 
                          src={message.sender.profile} 
                          alt={message.sender.name} 
                          className="rounded-circle"
                          style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                        />
                      ) : (
                        <div 
                          className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
                          style={{ width: '30px', height: '30px', fontSize: '0.8rem' }}
                        >
                          {message.sender.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  )}
                  <div 
                    className={`message-content p-3 rounded ${
                      isCurrentUser ? 'bg-primary text-white' : 'bg-light'
                    }`}
                    style={{ maxWidth: '75%' }}
                  >
                    {/* Show delete icon for admin users only */}
                    {currentUser?.role === 'admin' && (
                      <span
                        className="delete-message-icon"
                        style={{ float: 'right', cursor: 'pointer ', color: '#dc3545', marginLeft: 8, fontSize: '0.9rem' ,padding: '4px 6px',borderRadius: '50%',background:'#ddd' }}
                        title="Delete message"
                        onClick={() => handleDeleteMessage(message._id)}
                      >
                       <BsTrash />
                      </span>
                    )}
                    {message.imageUrl && (
                      <div className="mb-2">
                        <img
                          src={message.imageUrl}
                          alt="chat-img"
                          style={{ maxWidth: 220, maxHeight: 180, borderRadius: 8, border: '1px solid #eee', objectFit: 'cover', cursor: 'pointer' }}
                          onClick={() => onImageClick && onImageClick(message.imageUrl)}
                        />
                      </div>
                    )}
                    {message.content && <div>{message.content}</div>}
                    <div className="message-time">
                      <small className={isCurrentUser ? 'text-white-50' : 'text-muted'}>
                        {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                      </small>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
        
        {isTyping && (
          <div className="typing-indicator d-flex align-items-center mt-2">
            <small className="text-muted me-2">{otherUser.name} is typing</small>
            <div className="typing-dots">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="chat-input p-3 border-top">
        <form onSubmit={handleSend} className="d-flex align-items-center" style={{ gap: 8 }}>
          <label className="btn btn-outline-secondary mb-0" style={{ position: 'relative' }} title="Attach image">
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={e => {
                const file = e.target.files[0];
                if (file) {
                  setImageFile(file);
                  setImagePreview(URL.createObjectURL(file));
                }
              }}
              disabled={loading}
            />
            <span role="img" aria-label="Attach">📎</span>
          </label>
          <input
            type="text"
            className="form-control me-2"
            placeholder="Type a message..."
            value={newMessage}
            onChange={handleInputChange}
            disabled={loading}
            style={{ minWidth: 0 }}
          />
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading || (!newMessage.trim() && !imageFile)}
          >
            {loading ? (
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Sending...</span>
              </div>
            ) : 'Send'}
          </button>
        </form>
        {imagePreview && (
          <div className="mt-2 d-flex align-items-center gap-2">
            <img src={imagePreview} alt="Preview" style={{ maxHeight: 80, borderRadius: 8, border: '1px solid #ddd', marginRight: 8 }} />
            <button className="btn btn-sm btn-outline-danger" onClick={() => { setImageFile(null); setImagePreview(null); }} type="button">Remove</button>
          </div>
        )}
      </div>

      <style jsx>{`
        .typing-dots {
          display: inline-flex;
          align-items: center;
        }

        .typing-dots .dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: #6c757d;
          margin: 0 1px;
          animation: typing 1.4s infinite ease-in-out;
        }

        .typing-dots .dot:nth-child(1) {
          animation-delay: -0.32s;
        }

        .typing-dots .dot:nth-child(2) {
          animation-delay: -0.16s;
        }

        @keyframes typing {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .message-content {
          word-wrap: break-word;
          word-break: break-word;
        }

        .chat-messages {
          scrollbar-width: thin;
          scrollbar-color: #ccc transparent;
        }

        .chat-messages::-webkit-scrollbar {
          width: 6px;
        }

        .chat-messages::-webkit-scrollbar-track {
          background: transparent;
        }

        .chat-messages::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 3px;
        }

        .chat-messages::-webkit-scrollbar-thumb:hover {
          background: #999;
        }

        .message {
          animation: fadeIn 0.3s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ChatMessages;