import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { getDatabase, ref, set } from 'firebase/database';
import { auth } from '../firebase';

export default function OnboardingScreen({ navigation }) {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [skillsToTeach, setSkillsToTeach] = useState('');
  const [skillsToLearn, setSkillsToLearn] = useState('');

  const handleContinue = async () => {
    try {
      const uid = auth.currentUser.uid;
      const db = getDatabase();

      await set(ref(db, 'users/' + uid), {
        name,
        bio,
        email: auth.currentUser.email,
        skillsToTeach: skillsToTeach.split(',').map(skill => skill.trim()),
        skillsToLearn: skillsToLearn.split(',').map(skill => skill.trim()),
      });

      Alert.alert('Success', 'Your profile has been saved!');
      navigation.navigate('Profile'); // You can change this to another screen
    } catch (error) {
      console.error('Error saving user data:', error);
      Alert.alert('Error', 'Something went wrong while saving your data.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Bio"
        value={bio}
        onChangeText={setBio}
        style={styles.input}
        multiline
      />
      <TextInput
        placeholder="Skills to Teach (comma separated)"
        value={skillsToTeach}
        onChangeText={setSkillsToTeach}
        style={styles.input}
      />
      <TextInput
        placeholder="Skills to Learn (comma separated)"
        value={skillsToLearn}
        onChangeText={setSkillsToLearn}
        style={styles.input}
      />

      <Button title="Continue" onPress={handleContinue} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center'
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 20,
    padding: 10
  }
});
