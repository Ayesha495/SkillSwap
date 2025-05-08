import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignupScreen from './Screens/SignupScreen';
import LoginScreen from './Screens/LoginScreen';
import Profile from './Screens/Profile';
import OnboardingScreen from './Screens/OnboardingScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Signup">
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} /> 
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Profile" component={Profile} />
        {/* Add other screens here */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
