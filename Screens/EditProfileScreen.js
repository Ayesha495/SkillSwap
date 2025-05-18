import React, { useEffect, useState, useContext } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity,
  Image, 
  StyleSheet, 
  ScrollView, 
  Alert,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ref, get, child } from 'firebase/database';
import { db, auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { saveUserProfile } from '../utils/firebasehelpers';
import { AuthContext } from '../AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function EditProfileScreen() {
  const [name, setName] = useState('');
  const [skillsToTeach, setSkillsToTeach] = useState([]);
  const [skillsToLearn, setSkillsToLearn] = useState([]); // NEW
  const [newSkill, setNewSkill] = useState('');
  const [newLearnSkill, setNewLearnSkill] = useState(''); // NEW
  const [image, setImage] = useState(null);
  const [bio, setBio] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const { user, loading } = useContext(AuthContext);
  const navigation = useNavigation();

  if (loading || !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0B9B9B" />
      </View>
    );
  }
  
  const userId = user?.uid;

 const handleLogout = () => {
  Alert.alert(
    'Log Out',
    'Are you sure you want to log out?',
    [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Log Out', 
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut(auth);
            console.log('Sign out successful');
          } catch (error) {
            console.log('Sign out error:', error);
            Alert.alert('Logout failed', error.message);
          }
        }
      }
    ]
  );
};

  useEffect(() => {
    const loadProfile = async () => {
      if (!userId) return;
      try {
        const cachedProfile = await AsyncStorage.getItem('userProfile');
        if (cachedProfile) {
          const data = JSON.parse(cachedProfile);
          setName(data.name || '');
          setBio(data.bio || '');
          setSkillsToTeach(data.skillsToTeach || []);
          setSkillsToLearn(data.skillsToLearn || []); // NEW
          setImage(data.image || null);
        }
        const snapshot = await get(child(ref(db), `users/${userId}`));
        if (snapshot.exists()) {
          const data = snapshot.val();
          setName(data.name || '');
          setBio(data.bio || '');
          setSkillsToTeach(data.skillsToTeach || []);
          setSkillsToLearn(data.skillsToLearn || []); // NEW
          setImage(data.image || null);
          await AsyncStorage.setItem('userProfile', JSON.stringify(data));
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
    if (!name.trim()) {
      Alert.alert("Missing Information", "Please enter your name");
      return;
    }
    try {
      setIsSaving(true);
      // Add skillsToLearn to saveUserProfile
      await saveUserProfile(userId, name, image, skillsToTeach, bio, user.email, skillsToLearn);
      setIsSaving(false);
      Alert.alert('Success', 'Your profile has been updated successfully');
    } catch (error) {
      setIsSaving(false);
      Alert.alert('Error', error.message);
    }
  };

  // --- Skills to Teach ---
  const addSkill = () => {
    if (newSkill.trim()) {
      if (skillsToTeach.includes(newSkill.trim())) {
        Alert.alert('Duplicate Skill', 'This skill is already in your list');
        return;
      }
      setSkillsToTeach([...skillsToTeach, newSkill.trim()]);
      setNewSkill('');
    }
  };
  const removeSkill = (index) => {
    Alert.alert(
      'Remove Skill',
      `Are you sure you want to remove "${skillsToTeach[index]}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
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

  // --- Skills to Learn (copy logic) ---
  const addLearnSkill = () => {
    if (newLearnSkill.trim()) {
      if (skillsToLearn.includes(newLearnSkill.trim())) {
        Alert.alert('Duplicate Skill', 'This skill is already in your list');
        return;
      }
      setSkillsToLearn([...skillsToLearn, newLearnSkill.trim()]);
      setNewLearnSkill('');
    }
  };
  const removeLearnSkill = (index) => {
    Alert.alert(
      'Remove Skill',
      `Are you sure you want to remove "${skillsToLearn[index]}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            const updated = [...skillsToLearn];
            updated.splice(index, 1);
            setSkillsToLearn(updated);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>My Profile</Text>
          
          <View style={styles.avatarContainer}>
            <Image
              source={image ? { uri: image } : require('../assets/profile.png')}
              style={styles.avatar}
            />
            <TouchableOpacity 
              style={styles.imageButton} 
              onPress={pickImage}
            >
              <Ionicons name="camera" size={18} color="#FFF" />
              <Text style={styles.imageButtonText}>Change Photo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />

            <Text style={styles.label}>Bio</Text>
            <TextInput
              placeholder="Tell people about yourself"
              value={bio}
              onChangeText={setBio}
              style={[styles.input, styles.bioInput]}
              multiline
              numberOfLines={4}
            />

            {/* Skills I Can Teach */}
            <Text style={styles.label}>Skills I Can Teach</Text>
            <View style={styles.skillsInputContainer}>
              <TextInput
                placeholder="Add a skill"
                value={newSkill}
                onChangeText={setNewSkill}
                style={styles.skillInput}
                onSubmitEditing={addSkill}
              />
              <TouchableOpacity 
                style={styles.addButton} 
                onPress={addSkill}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.skillsContainer}>
              {skillsToTeach.map((skill, index) => (
                <View key={index} style={styles.skillItem}>
                  <Text style={styles.skillText}>{skill}</Text>
                  <TouchableOpacity 
                    onPress={() => removeSkill(index)}
                    style={styles.removeButton}
                  >
                    <Ionicons name="close-circle" size={16} color="#5E5E5E" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Skills I Want to Learn */}
            <Text style={styles.label}>Skills I Want to Learn</Text>
            <View style={styles.skillsInputContainer}>
              <TextInput
                placeholder="Add a skill to learn"
                value={newLearnSkill}
                onChangeText={setNewLearnSkill}
                style={styles.skillInput}
                onSubmitEditing={addLearnSkill}
              />
              <TouchableOpacity 
                style={styles.addButton} 
                onPress={addLearnSkill}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.skillsContainer}>
              {skillsToLearn.map((skill, index) => (
                <View key={index} style={[styles.skillItem, { backgroundColor: '#FEF3E7' }]}>
                  <Text style={[styles.skillText, { color: '#F4A261' }]}>{skill}</Text>
                  <TouchableOpacity 
                    onPress={() => removeLearnSkill(index)}
                    style={styles.removeButton}
                  >
                    <Ionicons name="close-circle" size={16} color="#5E5E5E" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={saveProfile}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <Text style={styles.saveButtonText}>Save Profile</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.logoutButton} 
              onPress={handleLogout}
            >
              <Text style={styles.logoutButtonText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7FCFC',
  },
  keyboardAvoid: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7FCFC',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#0B6E6E',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#0B9B9B',
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#30A8A8',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginTop: 8,
  },
  imageButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  formContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#104F4F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0B6E6E',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F0F8F8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D0E8E8',
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    color: '#333',
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  skillsInputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  skillInput: {
    flex: 1,
    backgroundColor: '#F0F8F8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D0E8E8',
    padding: 12,
    fontSize: 16,
    marginRight: 8,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#30A8A8',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  skillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F5F5',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
  },
  skillText: {
    color: '#0B6E6E',
    marginRight: 4,
    fontSize: 14,
  },
  removeButton: {
    padding: 2,
  },
  saveButton: {
    backgroundColor: '#0B9B9B',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#F55F5F',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#F55F5F',
    fontWeight: '600',
    fontSize: 16,
  },
});