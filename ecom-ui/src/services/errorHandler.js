// Error handling utility for API requests
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 403:
        return 'Access denied: You do not have permission to perform this action';
      case 404:
        return 'Resource not found';
      case 400:
        return data?.message || 'Invalid request';
      case 500:
        return data?.message || 'Server error: Please try again later';
      case 503:
        return 'Service temporarily unavailable. Database connection issues detected.';
      default:
        return data?.message || `Server error (${status})`;
    }
  } else if (error.request) {
    // Network error - no response received
    return 'Network error: Unable to connect to server. Please check your internet connection and ensure the server is running.';
  } else {
    // Other error
    return error.message || 'An unexpected error occurred';
  }
};

// Check server health
export const checkServerHealth = async () => {
  try {
    const response = await fetch('http://localhost:5001/health');
    const health = await response.json();
    return health;
  } catch (error) {
    console.error('Health check failed:', error);
    return {
      status: 'Server not reachable',
      database: { status: 'unknown' },
      error: error.message
    };
  }
};

// Retry mechanism for failed requests
export const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      console.log(`Request failed (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
};
