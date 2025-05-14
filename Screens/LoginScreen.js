import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../firebase';
import { AuthContext } from '../AuthContext'; 
import { sendPasswordResetEmail } from 'firebase/auth'; // Import the function to send password reset email
import { TouchableOpacity } from 'react-native-gesture-handler'; // Import TouchableOpacity for the "Forgot Password?" link

export default function LoginScreen({ navigation }) {
  const { setIsLoggedIn } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        Alert.alert('Email Not Verified', 'Please verify your email before logging in.');
        return;
      }

      await AsyncStorage.setItem('user', JSON.stringify(user));
      setIsLoggedIn(true); // This triggers re-render in App.js

      Alert.alert('Login Successful', 'Welcome!');
      // No need to navigate manually anymore
    } catch (err) {
      console.error('Login error:', err.code, err.message);
      switch (err.code) {
        case 'auth/invalid-email':
          Alert.alert('Login Error', 'Invalid email format.');
          break;
        case 'auth/user-not-found':
          Alert.alert('Login Error', 'No account found with this email.');
          break;
        case 'auth/wrong-password':
          Alert.alert('Login Error', 'Incorrect password.');
          break;
        default:
          Alert.alert('Login Error', err.message);
      }
    }
  };

  const handleForgotPassword = async () => {
  if (!email) {
    Alert.alert('Enter your email first');
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    Alert.alert('Password Reset', 'A reset link has been sent to your email.');
  } catch (error) {
    Alert.alert('Error', error.message);
  }
};

  return (
    <View style={styles.container}>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
      <Button title="Log In" onPress={handleLogin} />
      <Text onPress={() => navigation.navigate('Signup')} style={styles.link}>
        Don't have an account? Sign up
      </Text>
  <Text style={styles.forgotText} onPress={handleForgotPassword}>Forgot Password?</Text>


    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { borderBottomWidth: 1, marginBottom: 15 },
  link: { color: 'blue', marginTop: 20 },
  forgotText: {
  marginTop: 10,
  color: '#D0604C',
  textAlign: 'center',
  textDecorationLine: 'underline',
}

});
