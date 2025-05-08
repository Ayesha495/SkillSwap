import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignupScreen from './Screens/SignupScreen';
import LoginScreen from './Screens/LoginScreen';
import Profile from './Screens/Profile';
import SplashScreen from './Screens/SplashScreen';
import GuideScreen1 from './Screens/GuideScreen1';
import OnboardingScreen from './Screens/OnboardingScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Guide1" component={GuideScreen1} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} /> 
        <Stack.Screen name="Profile" component={Profile} />
        {/* Add other screens here */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
