import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send verification email
      await sendEmailVerification(user);
      Alert.alert('Verify Email', 'A verification link has been sent to your email.');

      // 🔥 Sign the user out to avoid auto-redirects
      await signOut(auth);

      // ✅ Now go to Onboarding screen
      navigation.navigate('Onboarding');

    } catch (error) {
      console.error('Signup error:', error.code, error.message);
      switch (error.code) {
        case 'auth/email-already-in-use':
          Alert.alert('Error', 'This email is already in use.');
          break;
        case 'auth/invalid-email':
          Alert.alert('Error', 'Invalid email format.');
          break;
        case 'auth/weak-password':
          Alert.alert('Error', 'Password should be at least 6 characters.');
          break;
        default:
          Alert.alert('Signup Error', error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
      <Button title="Sign Up" onPress={handleSignup} />
      <Text onPress={() => navigation.navigate('Login')} style={styles.link}>
        Already have an account? Log in
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { borderBottomWidth: 1, marginBottom: 15 },
  link: { color: 'blue', marginTop: 20 }
});
