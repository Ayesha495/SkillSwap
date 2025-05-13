import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext, AuthProvider } from './AuthContext'; // import the context
import LoginScreen from './Screens/LoginScreen';
import SignupScreen from './Screens/SignupScreen';
import OnboardingScreen from './Screens/OnboardingScreen';
import MainTabs from './Screens/MainTabs';
import SplashScreen from './Screens/SplashScreen';

const Stack = createNativeStackNavigator();

function AppInner() {
  const { isLoggedIn } = useContext(AuthContext);

  if (isLoggedIn === null) return <SplashScreen />;

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <MainTabs />
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
