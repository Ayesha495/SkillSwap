// Firebase API configuration
const firebaseConfig = {
  apiKey: "AIzaSyAE2G29-wUIxCCc-9YPDr-z33YW6CX1PLQ",
  projectId: "skillswap-4980a",
  databaseURL: "https://skillswap-4980a-default-rtdb.firebaseio.com"
};

// Base URL for REST API calls
const API_BASE_URL = firebaseConfig.databaseURL;

// Authentication helpers
let currentUser = null;

// Function to sign in with email and password
const signInWithEmailAndPassword = async (email, password) => {
  try {
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseConfig.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }
    
    currentUser = {
      uid: data.localId,
      email: data.email,
      idToken: data.idToken,
      refreshToken: data.refreshToken
    };
    
    localStorage.setItem('firebaseUser', JSON.stringify(currentUser));
    
    return currentUser;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

// Function to create user with email and password
const createUserWithEmailAndPassword = async (email, password) => {
  try {
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseConfig.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }
    
    currentUser = {
      uid: data.localId,
      email: data.email,
      idToken: data.idToken,
      refreshToken: data.refreshToken
    };
    
    localStorage.setItem('firebaseUser', JSON.stringify(currentUser));
    
    return currentUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Function to sign out
const signOut = () => {
  currentUser = null;
  localStorage.removeItem('firebaseUser');
};

// Function to get current user
const getCurrentUser = () => {
  if (currentUser) return currentUser;
  
  const storedUser = localStorage.getItem('firebaseUser');
  if (storedUser) {
    currentUser = JSON.parse(storedUser);
    return currentUser;
  }
  
  return null;
};

// Database API functions
const dbAPI = {
  // Read data
  get: async (path) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${path}.json`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching data from ${path}:`, error);
      throw error;
    }
  },
  
  // Write data
  set: async (path, data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${path}.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      console.error(`Error setting data at ${path}:`, error);
      throw error;
    }
  },
  
  // Update data
  update: async (path, data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${path}.json`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      console.error(`Error updating data at ${path}:`, error);
      throw error;
    }
  },
  
  // Delete data
  remove: async (path) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${path}.json`, {
        method: 'DELETE'
      });
      return await response.json();
    } catch (error) {
      console.error(`Error removing data at ${path}:`, error);
      throw error;
    }
  },
  
  // Listen for data changes (polling implementation)
  listen: (path, callback, interval = 5000) => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/${path}.json`);
        const data = await response.json();
        callback(data);
      } catch (error) {
        console.error(`Error in listener for ${path}:`, error);
      }
    };
    
    // Initial fetch
    fetchData();
    
    // Set up polling interval
    const intervalId = setInterval(fetchData, interval);
    
    // Return function to stop listening
    return () => clearInterval(intervalId);
  }
};

// Check if a user is logged in
if (getCurrentUser()) {
  console.log("Logged in as:", getCurrentUser().email);
} else {
  console.log("No user is logged in.");
}

// Auth exports
const auth = {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  getCurrentUser
};

// Export them for use in your app
export { firebaseConfig, API_BASE_URL, auth, dbAPI as db };