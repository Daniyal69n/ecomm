import React, { useState, useEffect } from 'react';
import { getConversations } from '../services/chatService';
import { getSocket } from '../services/socketService';
import { formatDistanceToNow } from 'date-fns';

const ConversationList = ({ onSelectConversation, selectedConversationId }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const currentUser = JSON.parse(localStorage.getItem('alfauser'));
  const isAdmin = currentUser?.role === 'admin';

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const data = await getConversations();
      setConversations(data);
      setError(null);
    } catch (err) {
      setError('Failed to load conversations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();

    // Setup socket for real-time conversation updates
    const socket = getSocket();
    
    if (socket) {
      // Remove previous listeners to avoid duplicates
      socket.off('new_message');
      socket.off('conversation_updated');
      
      // Listen for new messages to update conversation list
      socket.on('new_message', (data) => {
        console.log('Received new message in conversation list:', data);
        
        // Update the conversation list with new message info
        setConversations(prev => {
          const updatedConversations = prev.map(conv => {
            if (conv._id === data.conversationId) {
              return {
                ...conv,
                lastMessage: {
                  content: data.content,
                  createdAt: data.createdAt || new Date().toISOString()
                },
                unreadCount: data.senderId !== currentUser._id ? (conv.unreadCount || 0) + 1 : conv.unreadCount,
                updatedAt: data.createdAt || new Date().toISOString()
              };
            }
            return conv;
          });
          
          // Sort conversations by updatedAt (most recent first)
          return updatedConversations.sort((a, b) => 
            new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)
          );
        });
      });

      // Listen for conversation updates
      socket.on('conversation_updated', (data) => {
        console.log('Conversation updated:', data);
        fetchConversations(); // Refresh conversations
      });
    }
    
    return () => {
      if (socket) {
        socket.off('new_message');
        socket.off('conversation_updated');
      }
    };
  }, [currentUser._id]);

  // Expose refresh function to parent
  useEffect(() => {
    window.refreshConversations = fetchConversations;
    return () => {
      delete window.refreshConversations;
    };
  }, []);

  const getOtherParticipant = (conversation) => {
    return conversation.participants.find(
      p => p._id !== currentUser._id
    );
  };

  if (loading) return <div className="text-center py-4">Loading conversations...</div>;
  
  if (error) return <div className="alert alert-danger">{error}</div>;
  
  if (conversations.length === 0) {
    return (
      <div className="text-center py-4">
        {isAdmin 
          ? "No conversations with sellers yet." 
          : "Start a conversation with admin."}
      </div>
    );
  }

  return (
    <div className="conversation-list">
      {conversations.map(conversation => {
        const otherUser = getOtherParticipant(conversation);
        const isSelected = selectedConversationId === conversation._id;
        // Defensive: skip rendering if otherUser is not found
        if (!otherUser) {
          return (
            <div key={conversation._id} className="conversation-item p-3 border-bottom text-danger">
              <span>Unknown participant</span>
            </div>
          );
        }
        return (
          <div 
            key={conversation._id}
            className={`conversation-item p-3 border-bottom ${isSelected ? 'active bg-light' : ''}`}
            onClick={() => onSelectConversation(conversation)}
          >
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0">
                {otherUser.profile ? (
                  <img 
                    src={otherUser.profile} 
                    alt={otherUser.name} 
                    className="rounded-circle"
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                  />
                ) : (
                  <div 
                    className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
                    style={{ width: '50px', height: '50px' }}
                  >
                    {otherUser.name ? otherUser.name.charAt(0).toUpperCase() : '?'}
                  </div>
                )}
              </div>
              <div className="flex-grow-1 ms-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">
                    {otherUser.name}
                    
                  </h6>
                  {conversation.lastMessage && (
                    <small className="text-muted hide-mobile">
                      {formatDistanceToNow(new Date(conversation.lastMessage.createdAt), { addSuffix: true })}
                    </small>
                  )}
                </div>
                {conversation.lastMessage && (
                  <div className="text-truncate hide-mobile" style={{ maxWidth: '250px' }}>
                    <small className={conversation.unreadCount > 0 ? 'fw-bold' : 'text-muted'}>
                      {conversation.lastMessage.content}
                    </small>
                  </div>
                )}
                {conversation.unreadCount > 0 && (
                  <span className="badge bg-primary rounded-pill">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConversationList;