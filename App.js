import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext, AuthProvider } from './AuthContext'; // import the context
import LoginScreen from './Screens/LoginScreen';
import SignupScreen from './Screens/SignupScreen';
import OnboardingScreen from './Screens/OnboardingScreen';
import MainTabs from './Screens/MainTabs';
import SplashScreen from './Screens/SplashScreen';
import GuideScreen1 from './Screens/GuideScreen1';
import TeacherProfile from './Screens/TeacherProfile';
import AllTeachersScreen from './Screens/AllTeachersScreen';
import SkillUsersScreen from './Screens/SkillUsersScreen';
import EditProfileScreen from './Screens/EditProfileScreen';
import ProfileScreen from './Screens/Profile';

const Stack = createNativeStackNavigator();

function AppInner() {
  const { isLoggedIn } = useContext(AuthContext);

  if (isLoggedIn === null) return <SplashScreen />;

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="TeacherProfile" component={TeacherProfile} />
          <Stack.Screen name="AllTeachers" component={AllTeachersScreen} />
          <Stack.Screen name="SkillUsers" component={SkillUsersScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>

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
