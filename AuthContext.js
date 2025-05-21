// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadUserProfile, loadCachedProfile } from './utils/firebasehelpers';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase'; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore user from AsyncStorage for fast UI   
  useEffect(() => {
    const restoreUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setIsLoggedIn(true);
      }
    };
    restoreUser();
  }, []);

  // Listen to Firebase Auth state changes (source of truth)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setIsLoggedIn(true);
        await AsyncStorage.setItem('user', JSON.stringify(firebaseUser));
      } else {
        setUser(null);
        setIsLoggedIn(false);
        await AsyncStorage.removeItem('user');
        await AsyncStorage.removeItem('userProfile');
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user?.uid) {
      loadCachedProfile().then(cached => {
        if (cached) {
          setUserProfile(cached);
        } else {
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
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser, userProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
