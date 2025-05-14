import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ref, get, child } from 'firebase/database';
import { db, auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { saveUserProfile } from '../utils/firebasehelpers';
import { AuthContext } from '../AuthContext';

export default function Profile() {
  const [name, setName] = useState('');
  const [skillsToTeach, setSkillsToTeach] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [image, setImage] = useState(null);
  const [bio, setBio] = useState('');


  const { user, loading } = useContext(AuthContext);
  if (loading) {
  return <ActivityIndicator size="large" style={{ flex: 1 }} />;
}
const userId = user?.uid;

  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('user');
      navigation.replace('Login');
      Alert.alert('Logged Out', 'You have been logged out successfully.');
    } catch (error) {
      Alert.alert('Logout Error', error.message);
    }
  };

 useEffect(() => {
  const loadProfile = async () => {
    if (!userId) {
      console.log('❌ No userId yet');
      return;
    }

    console.log('✅ userId:', userId);

    try {
      // 1. Load from AsyncStorage first (cached)
      const cachedProfile = await AsyncStorage.getItem('userProfile');
      if (cachedProfile) {
        const data = JSON.parse(cachedProfile);
        setName(data.name || '');
        setBio(data.bio || '');
        setSkillsToTeach(data.skillsToTeach || []);
        setImage(data.image || null);
        console.log('✅ Loaded profile from cache');
      }

      // 2. Then try to load fresh data from Firebase
      const snapshot = await get(child(ref(db), `users/${userId}`));
      if (snapshot.exists()) {
        const data = snapshot.val();
        setName(data.name || '');
        setBio(data.bio || '');
        setSkillsToTeach(data.skillsToTeach || []);
        setImage(data.image || null);

        // update cache
        await AsyncStorage.setItem('userProfile', JSON.stringify(data));
        console.log('✅ Loaded profile from Firebase and updated cache');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  loadProfile();
}, [userId]);


  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const saveProfile = async () => {
    try {
      await saveUserProfile(userId, name, image, skillsToTeach, bio);
      Alert.alert('Profile Updated');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setSkillsToTeach([...skillsToTeach, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (index) => {
  Alert.alert(
    'Remove Skill',
    `Are you sure you want to remove "${skillsToTeach[index]}"?`,
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          const updated = [...skillsToTeach];
          updated.splice(index, 1);
          setSkillsToTeach(updated);
        },
      },
    ]
  );
};


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Image
        source={image ? { uri: image } : require('../assets/profile.png')}
        style={styles.avatar}
      />
      <Button title="Pick Profile Image" onPress={pickImage} />

      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
  placeholder="Bio"
  value={bio}
  onChangeText={setBio}
  style={[styles.input, { height: 80 }]}
  multiline
/>

      <TextInput
        placeholder="Add skill to teach"
        value={newSkill}
        onChangeText={setNewSkill}
        style={styles.input}
      />
      <Button title="Add Skill" onPress={addSkill} />
      

      <Text style={styles.subTitle}>Skills to Teach:</Text>
      {skillsToTeach.map((skill, index) => (
        <View key={index} style={styles.skillItem}>
          <Text>{skill}</Text>
          <Button title="Remove" onPress={() => removeSkill(index)} />
        </View>
      ))}

      


      <Button title="Save Profile" onPress={saveProfile} />

      <View style={{ marginTop: 40 }}>
        <Button title="Log Out" onPress={handleLogout} color="#D0604C" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 20,
  },
  skillItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});
