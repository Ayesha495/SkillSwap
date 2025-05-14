import { ref, set, get, child } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../firebase'; // make sure this path is correct
import { auth } from '../firebase'; // make sure this path is correct

export const saveUserProfile = async (uid, name, image, skillsToTeach, bio) => {
  try {
    const userData = {
      name,
      bio,
      email: auth.currentUser.email, // <- matches setEmail(data.email)
      image: image,             // <- matches setImage(data.image)
      skillsToTeach,
    };

    // Save to Firebase Realtime Database
    await set(ref(db, `users/${uid}`), userData);

    // Save to AsyncStorage
    await AsyncStorage.setItem('userProfile', JSON.stringify(userData));

    console.log('✅ Profile saved to Firebase and local storage');
  } catch (error) {
    console.error('❌ Error saving profile:', error);
  }
};

export const loadUserProfile = async (uid) => {
  try {
    const snapshot = await get(child(ref(db), `users/${uid}`));
    if (snapshot.exists()) {
      const profileData = snapshot.val();

      // Save to AsyncStorage
      await AsyncStorage.setItem('userProfile', JSON.stringify(profileData));

      console.log('✅ Profile loaded from Firebase');
      return profileData;
    } else {
      console.log('⚠️ No profile found');
      return null;
    }
  } catch (error) {
    console.error('❌ Error loading profile:', error);
    return null;
  }
};

export const loadCachedProfile = async () => {
  try {
    const cached = await AsyncStorage.getItem('userProfile');
    if (cached) {
      console.log('✅ Profile loaded from AsyncStorage');
      return JSON.parse(cached);
    }
    return null;
  } catch (error) {
    console.error('❌ Error loading cached profile:', error);
    return null;
  }
};
