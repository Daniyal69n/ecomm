import React, { useState, useEffect } from 'react';
import ConversationList from './ConversationList.jsx';
import ChatMessages from './ChatMessages.jsx';
import { getOrCreateConversation } from '../services/chatService';
import { initSocket, disconnectSocket } from '../services/socketService';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { showError } from '../components/toast';

const ChatPage = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState('');
  const currentUser = JSON.parse(localStorage.getItem('alfauser'));
  const navigate = useNavigate();
  // Handler for image click in chat
  const handleImageClick = (imgUrl) => {
    setModalImageUrl(imgUrl);
    setShowImageModal(true);
  };
  const closeImageModal = () => {
    setShowImageModal(false);
    setModalImageUrl('');
  };
  
  // Initialize socket connection
  useEffect(() => {
    const socket = initSocket();
    
    if (socket) {
      // Monitor socket connection status
      socket.on('connect', () => {
        console.log('Socket connected in ChatPage with ID:', socket.id);
        setSocketConnected(true);
      });
      
      socket.on('disconnect', () => {
        console.log('Socket disconnected in ChatPage');
        setSocketConnected(false);
      });
      
      socket.on('connect_error', (error) => {
        console.log('Socket connection error in ChatPage:', error);
        setSocketConnected(false);
      });
      
      // Test socket functionality
      socket.on('message_sent', (data) => {
        console.log('Received message_sent confirmation:', data);
      });

      socket.on('test_response', (data) => {
        console.log('Received test response:', data);
      showError('Socket test successful! Check console for details.');
      });
      
      // Set initial connection status
      setSocketConnected(socket.connected);
    }
    
    // Clean up socket connection on unmount
    return () => {
      if (socket) {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('connect_error');
        socket.off('message_sent');
        socket.off('test_response');
      }
      disconnectSocket();
    };
  }, []);
  
  // If current user is a seller, fetch admin user and auto-load conversation
  useEffect(() => {
    const fetchAdminAndLoadConversation = async () => {
      if (currentUser?.role !== 'seller') return;
      
      try {
        setLoading(true);
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
        
        // First, get admin user
        let admin = null;
        try {
          const res = await axios.get(`${API_URL}/users/admin`, {
            headers: { Authorization: `Bearer ${currentUser.token}` }
          });
          
          if (res.data && res.data._id) {
            admin = res.data;
            setAdminUser(res.data);
          }
        } catch (apiError) {
          console.error('Error fetching admin from API:', apiError);
          // Continue to fallback
        }
        
        // Fallback: Try to fetch all users
        if (!admin) {
          const allUsersRes = await axios.get(`${API_URL}/users`, {
            headers: { Authorization: `Bearer ${currentUser.token}` }
          });
          
          admin = allUsersRes.data.find(user => user.role === 'admin');
          if (admin) {
            setAdminUser(admin);
          }
        }
        
        // Auto-load conversation with admin
        if (admin) {
          console.log('🔄 Auto-loading conversation with admin for seller...');
          
          try {
            // First look for existing conversations
            const response = await axios.get(
              `${API_URL}/chat/conversations/user/admin`,
              { headers: { Authorization: `Bearer ${currentUser.token}` } }
            );
            
            if (response.data && response.data.length > 0) {
              const existingConv = response.data[0];
              console.log('✅ Found existing conversation with admin:', existingConv._id);
              setSelectedConversation(existingConv);
            } else {
              // Create new conversation
              console.log('🆕 Creating new conversation with admin...');
              const conversation = await getOrCreateConversation(admin._id);
              console.log('✅ Created conversation:', conversation._id);
              setSelectedConversation(conversation);
            }
          } catch (convError) {
            console.error('❌ Error loading conversation:', convError);
          }
        }
        
      } catch (err) {
        console.error('All admin fetch methods failed:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAdminAndLoadConversation();
  }, [currentUser?.role, currentUser?.token]);
  
  // Start new conversation with admin (for sellers)
  const startConversationWithAdmin = async () => {
    if (!adminUser) {
      console.error('Admin user not found');
      return;
    }
    
    try {
      setLoading(true);
      console.log('Starting conversation with admin:', adminUser);
      
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      
      // SOLUTION: Use a simpler, more reliable approach
      // First look for existing conversations with admin (using the special 'admin' parameter)
      try {
        console.log('Looking for existing conversations with admin');
        const response = await axios.get(
          `${API_URL}/chat/conversations/user/admin`,
          { headers: { Authorization: `Bearer ${currentUser.token}` } }
        );
        
        // If we found any conversations, use the first one
        if (response.data && response.data.length > 0) {
          const existingConv = response.data[0];
          console.log('Found existing conversation with admin:', existingConv._id);
          setSelectedConversation(existingConv);
          return;
        }
        
        console.log('No existing conversations found, creating a new one');
      } catch (findError) {
        console.log('Error finding conversations:', findError.message);
        // Continue to creation approach
      }
      
      // If no existing conversations were found, create a new one using our backend's special helper
      try {
        console.log('Creating new conversation with admin:', adminUser._id);
        
        // Use POST endpoint that has our safe creation helper
        const createResponse = await axios.post(
          `${API_URL}/chat/conversations`,
          { recipientId: adminUser._id },
          { headers: { Authorization: `Bearer ${currentUser.token}` } }
        );
        
        if (createResponse.data && createResponse.data._id) {
          console.log('Successfully created new conversation:', createResponse.data._id);
          setSelectedConversation(createResponse.data);
          return;
        }
      } catch (createError) {
        // Special handling for duplicate key errors
        if (createError.response?.data?.error?.includes('E11000 duplicate key error') || 
            createError.message.includes('duplicate key')) {
          
          console.log('Got duplicate key error - trying to find the conversation one more time');
          
          // Wait a bit for any race conditions to resolve
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Try finding the conversation again
          try {
            const retryResponse = await axios.get(
              `${API_URL}/chat/conversations/user/admin`,
              { headers: { Authorization: `Bearer ${currentUser.token}` } }
            );
            
            if (retryResponse.data && retryResponse.data.length > 0) {
              const foundConv = retryResponse.data[0];
              console.log('Found conversation after duplicate error:', foundConv._id);
              setSelectedConversation(foundConv);
              return;
            }
          } catch (retryError) {
            console.log('Error finding conversation after retry:', retryError.message);
          }
        }
        
        console.error('Failed to create conversation:', createError.message);
        throw createError;
      }
      
      throw new Error('Failed to find or create conversation with admin');
    } catch (err) {
      console.error('All attempts to start admin conversation failed:', err);
      showError('Could not connect to admin. Please try refreshing the page and try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Guard clause for authentication and role
  if (!currentUser) {
    navigate('/login');
    return null;
  }
  if (currentUser.role !== 'admin' && currentUser.role !== 'seller') {
    return (
      <div className="chat-modern-container" style={{ minHeight: '76vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)', padding: '0px 00' }}>
        <div className="chat-modern-wrapper" style={{ maxWidth: 1100, margin: '0 auto', borderRadius: 24, boxShadow: '0 8px 32px rgba(60,72,100,0.10)', background: '#fff', overflow: 'hidden', display: 'flex', minHeight: 600 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <h3>Unauthorized: Only sellers and admins can access the chat.</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-modern-container" style={{ minHeight: '76vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)', padding: '0px 0' }}>
      {/* Image Modal */}
      {showImageModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '18px',
            boxShadow: '0 2px 24px rgba(0,0,0,0.13)',
            textAlign: 'center',
            position: 'relative',
            maxWidth: '90vw',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img src={modalImageUrl} alt="Chat Attachment" style={{ maxWidth: '80vw', maxHeight: '80vh', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.10)' }} />
            <button onClick={closeImageModal} style={{
              marginTop: 18,
              background: '#e11d48',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 28px',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '17px',
              boxShadow: '0 1px 8px rgba(30,41,59,0.10)'
            }}>Close</button>
          </div>
        </div>
      )}
      <div className="chat-modern-wrapper responsive-chat-wrapper" style={{ maxWidth: 1100, margin: '0 auto', borderRadius: 24, boxShadow: '0 8px 32px rgba(60,72,100,0.10)', background: '#fff', overflow: 'hidden', display: 'flex', minHeight: 600, flexDirection: 'row' }}>
        {/* Seller: Always show chat box with admin */}
        {currentUser.role === 'seller' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, background: '#f3f4f6', padding: 0, display: 'flex', flexDirection: 'column' }}>
              <ChatMessages conversation={selectedConversation} onImageClick={handleImageClick} />
            </div>
          </div>
        )}
        {/* Admin: Show conversation list and chat area */}
        {currentUser.role === 'admin' && (
          <>
            <div className="responsive-conversation-list" style={{ width: 340, borderRight: '1px solid #e5e7eb', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
              <div className='mobile-none' style={{ padding: '24px 24px 16px', borderBottom: '1px solid #e5e7eb', background: 'linear-gradient(90deg, #6366f1 0%, #a5b4fc 100%)' }}>
                <h4 style={{ color: '#fff', margin: 0, fontWeight: 700, letterSpacing: 1 }}>Conversations</h4>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '0 0 16px 0' }}>
                <ConversationList onSelectConversation={setSelectedConversation} selectedConversationId={selectedConversation?._id} />
              </div>
            </div>
            <div className="responsive-chat-area" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '24px 32px', borderBottom: '1px solid #e5e7eb', background: 'linear-gradient(90deg, #6366f1 0%, #a5b4fc 100%)' }}>
                <h3 style={{ color: '#fff', margin: 0, fontWeight: 700, letterSpacing: 1 }}>Chat</h3>
                <p style={{ color: '#e0e7ff', margin: 0, fontSize: 14 }}>Select a conversation to chat</p>
              </div>
              <div style={{ flex: 1, background: '#f3f4f6', padding: 0, display: 'flex', flexDirection: 'column' }}>
                <ChatMessages conversation={selectedConversation} onImageClick={handleImageClick} />
              </div>
            </div>
          </>
        )}
      {/* Responsive styles for mobile chat */}
      <style>{`
        @media (max-width: 768px) {
          .responsive-chat-wrapper {
            flex-direction: column !important;
            min-height: 400px !important;
            border-radius: 0 !important;
            max-width: 100vw !important;
          }
          .responsive-conversation-list {
            width: 100vw !important;
            min-width: 0 !important;
            max-width: 100vw !important;
            border-right: none !important;
            border-bottom: 1px solid #e5e7eb !important;
            flex-direction: row !important;
            overflow-x: auto !important;
            overflow-y: visible !important;
            display: flex !important;
          }
          .responsive-conversation-list > div:first-child {
            min-width: 180px !important;
            flex: 1 1 180px !important;
          }
          .responsive-chat-area {
            flex: 1 1 100%;
            min-width: 0 !important;
            max-width: 100vw !important;
          }
        }
      `}</style>
      </div>
    </div>
  );
};

export default ChatPage;