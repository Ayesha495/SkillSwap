import React, { useState } from 'react';
import { 
  Text, 
  View, 
  TextInput, 
  Alert, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Image,
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { getDatabase, ref, set } from 'firebase/database';
import { auth } from '../firebase';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function OnboardingScreen({ navigation }) {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [skillsToTeach, setSkillsToTeach] = useState('');
  const [skillsToLearn, setSkillsToLearn] = useState('');
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // Request media library permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access your photos');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleContinue = async () => {
    if (!name.trim()) {
      Alert.alert('Missing Information', 'Please enter your name to continue');
      return;
    }
    
    try {
      const uid = auth.currentUser.uid;
      const db = getDatabase();

      // Prepare skills arrays, filter out empty strings
      const teachArr = skillsToTeach
        ? skillsToTeach.split(',').map(skill => skill.trim()).filter(Boolean)
        : [];
      const learnArr = skillsToLearn
        ? skillsToLearn.split(',').map(skill => skill.trim()).filter(Boolean)
        : [];

      await set(ref(db, 'users/' + uid), {
        name: name.trim(),
        bio: bio.trim(),
        email: auth.currentUser.email,
        photoURL: image,
        skillsToTeach: teachArr,
        skillsToLearn: learnArr,
      });

      Alert.alert('Success', 'Your profile has been saved!');
      navigation.navigate('Login'); // <-- Go to Login screen
    } catch (error) {
      console.error('Error saving user data:', error);
      Alert.alert('Error', 'Something went wrong while saving your data.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F9F9" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Create Your Profile</Text>
            <Text style={styles.headerSubtitle}>Tell the community about yourself</Text>
          </View>

          <View style={styles.imageContainer}>
            <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
              {image ? (
                <Image source={{ uri: image }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={50} color="#AADACD" />
                </View>
              )}
              <View style={styles.addPhotoButton}>
                <Ionicons name="camera" size={18} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
            <Text style={styles.addPhotoText}>Add Profile Photo</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#0B8C7C" />
              <TextInput
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
                placeholderTextColor="#95AEBB"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="information-circle-outline" size={20} color="#0B8C7C" />
              <TextInput
                placeholder="Bio - Tell us about yourself"
                value={bio}
                onChangeText={setBio}
                style={[styles.input, styles.bioInput]}
                multiline
                placeholderTextColor="#95AEBB"
                numberOfLines={4}
              />
            </View>

            <View style={styles.inputSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="school-outline" size={20} color="#0B8C7C" />
                <Text style={styles.sectionTitle}>Skills to Teach</Text>
              </View>
              <TextInput
                placeholder="e.g. Cooking, Photography, Spanish (comma separated)"
                value={skillsToTeach}
                onChangeText={setSkillsToTeach}
                style={styles.input}
                placeholderTextColor="#95AEBB"
              />
            </View>

            <View style={styles.inputSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="book-outline" size={20} color="#0B8C7C" />
                <Text style={styles.sectionTitle}>Skills to Learn</Text>
              </View>
              <TextInput
                placeholder="e.g. Guitar, Coding, French (comma separated)"
                value={skillsToLearn}
                onChangeText={setSkillsToLearn}
                style={styles.input}
                placeholderTextColor="#95AEBB"
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.primaryButton]} 
              onPress={handleContinue}
            >
              <Text style={styles.primaryButtonText}>Continue</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={styles.buttonIcon} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.secondaryButton]} 
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.secondaryButtonText}>Skip for Now</Text>
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
    backgroundColor: '#F0F9F9',
  },
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  headerContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0D4D56',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#5A8D9A',
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E0F5F2',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0B8C7C',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  addPhotoText: {
    fontSize: 16,
    color: '#0B8C7C',
    fontWeight: '500',
  },
  formContainer: {
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#2E4F4F',
  },
  bioInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#0B8C7C',
    fontWeight: '600',
    marginLeft: 8,
  },
  buttonContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    flexDirection: 'row',
  },
  primaryButton: {
    backgroundColor: '#0B8C7C',
    shadowColor: '#0B8C7C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0B8C7C',
  },
  secondaryButtonText: {
    color: '#0B8C7C',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcon: {
    marginLeft: 8,
  }
});

