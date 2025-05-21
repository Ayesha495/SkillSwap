import { ref, set, get, child, update } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../firebase'; // make sure this path is correct

// Add skillsToLearn as a parameter
export const saveUserProfile = async (uid, name, image, skillsToTeach, bio, email, skillsToLearn) => {
  try {
    const userData = {
      name,
      bio,
      email: email || '', 
      image,
      skillsToTeach,
      skillsToLearn: skillsToLearn || [], 
    };

    // Save to Firebase Realtime Database
    await set(ref(db, `users/${uid}`), userData);

    // Save each skill to the topics collection
    if (skillsToTeach && Array.isArray(skillsToTeach)) {
      const updates = {};
      skillsToTeach.forEach(skill => {
        // Each topic will have a list of userIds who can teach it
        updates[`topics/${skill}`] = {
          name: skill,
          // Optionally, you can store more info, like a list of userIds
        };
      });
      await update(ref(db), updates);
    }

    // Save to AsyncStorage
    await AsyncStorage.setItem('userProfile', JSON.stringify(userData));

    console.log('✅ Profile and topics saved to Firebase and local storage');
  } catch (error) {
    console.error('❌ Error saving profile:', error);
    throw error; 
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
