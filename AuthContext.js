// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadUserProfile, loadCachedProfile } from './utils/firebasehelpers';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [user, setUser] = useState(null); // ✅ FIXED: define user state
  const [userProfile, setUserProfile] = useState(null); // for profile data

  useEffect(() => {
    const checkLoginStatus = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      console.log('Stored User:', storedUser);
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed); // ✅ set user when found in AsyncStorage
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };
    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (user?.uid) {
      // First try loading from local storage
      loadCachedProfile().then(cached => {
        if (cached) {
          setUserProfile(cached);
        } else {
          // Otherwise load from Firebase
          loadUserProfile(user.uid).then(profile => {
            if (profile) {
              setUserProfile(profile);
            }
          });
        }
      });
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser, userProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
