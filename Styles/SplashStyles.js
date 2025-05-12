import { StyleSheet } from 'react-native';

const SplashStyles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 30,
    fontFamily: 'serif',
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: '#00a0a9',
  },
  img: {
    width: 200,
    height: 200,
    marginBottom: 40,
  },
});

export default SplashStyles;