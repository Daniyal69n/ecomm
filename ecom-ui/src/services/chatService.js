export const deleteMessage = async (messageId) => {
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
    const response = await axios.delete(
      `${API_URL}/chat/messages/${messageId}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error(`Error deleting message ${messageId}:`, error.response?.data || error.message);
    throw error;
  }
};
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('alfauser'));
  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  }
  return {};
};

export const getConversations = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('alfauser'));
    let endpoint = `${API_URL}/chat/conversations`;
    
    // For sellers, explicitly request only their conversations with admin
    if (user && user.role === 'seller') {
      console.log('Seller user - fetching only conversations with admin');
      endpoint = `${API_URL}/chat/conversations/user/admin`;
    }
    
    console.log(`Fetching conversations from: ${endpoint}`);
    const response = await axios.get(endpoint, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
};

export const getOrCreateConversation = async (otherUserId) => {
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
    
    console.log(`Getting or creating conversation with user: ${otherUserId}`);
    
    // Use the dedicated endpoint that combines get and create functionality
    try {
      console.log('Using combined get/create endpoint');
      const response = await axios.get(`${API_URL}/chat/conversations/with/${otherUserId}`, {
        headers: getAuthHeader()
      });
      
      if (response.data && response.data._id) {
        console.log('Successfully got or created conversation:', response.data._id);
        return response.data;
      }
    } catch (combinedError) {
      console.error('Error with combined endpoint:', combinedError.message);
      // Continue to fallback approach if combined endpoint fails
    }
    
    // Fallback: Use direct creation endpoint
    console.log('Using direct creation endpoint as fallback');
    try {
      const createResponse = await axios.post(
        `${API_URL}/chat/conversations`,
        { recipientId: otherUserId },
        { headers: getAuthHeader() }
      );
      
      if (createResponse.data && createResponse.data._id) {
        console.log('Successfully created conversation via direct endpoint:', createResponse.data._id);
        return createResponse.data;
      }
    } catch (createError) {
      console.error('Error with direct creation endpoint:', createError.message);
      // Continue to last fallback approach
    }
    
    // Last resort: Check if we have any conversations with this user
    console.log('Using last resort approach - checking user conversations');
    try {
      const userConversationsResponse = await axios.get(
        `${API_URL}/chat/conversations/user/${otherUserId}`,
        { headers: getAuthHeader() }
      );
      
      if (userConversationsResponse.data && userConversationsResponse.data.length > 0) {
        const conversation = userConversationsResponse.data[0];
        console.log('Found existing conversation in user conversations:', conversation._id);
        return conversation;
      }
    } catch (userConvError) {
      console.error('Error checking user conversations:', userConvError.message);
    }
    
    throw new Error('All attempts to get or create conversation failed');
  } catch (error) {
    console.error('Fatal error in getOrCreateConversation:', error);
    throw error;
  }
};

export const getMessages = async (conversationId) => {
  try {
    const response = await axios.get(`${API_URL}/chat/conversations/${conversationId}/messages`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error(`Error getting messages for conversation ${conversationId}:`, error.response?.data || error.message);
    // If we get an auth error, it might be a stale token - we could add logic to refresh token here
    if (error.response?.status === 403) {
      console.warn('Authorization error when fetching messages. User may not be a participant.');
    }
    throw error;
  }
};

export const sendMessage = async (conversationId, content, imageBase64) => {
  try {
    const payload = { content };
    if (imageBase64) payload.imageBase64 = imageBase64;
    const response = await axios.post(
      `${API_URL}/chat/conversations/${conversationId}/messages`,
      payload,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error(`Error sending message to conversation ${conversationId}:`, error.response?.data || error.message);
    // Handle different error types
    if (error.response) {
      const { status, data } = error.response;
      if (status === 403) {
        // Special case for seller-admin conversations
        const user = JSON.parse(localStorage.getItem('alfauser'));
        if (user?.role === 'seller') {
          throw new Error('Authorization error: Make sure you are chatting with the admin account. If the issue persists, try refreshing the page or starting a new conversation.');
        } else {
          throw new Error('You are not authorized to send messages in this conversation. This may be due to permission issues.');
        }
      } else if (status === 404) {
        throw new Error('The conversation could not be found. It may have been deleted.');
      } else {
        throw new Error(data.message || 'Failed to send message');
      }
    }
    throw error;
  }
};

export const getUnreadCount = async () => {
  const response = await axios.get(`${API_URL}/chat/messages/unread`, {
    headers: getAuthHeader()
  });
  return response.data;
};