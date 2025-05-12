import { StyleSheet } from 'react-native';

const Guide1Styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 10,
    marginBottom: 20,
    fontSize: 25,
    fontFamily: 'serif',
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: '#00a0a9',
  },
  text2: {
    fontSize: 14,
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
    color: '#00a0a9',
  },
  textbox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 60,
    marginTop: 20,
  },
  img: {
    width: 200,
    height: 200,
    marginBottom: 30,
    marginTop: 30,
  },
});

export default Guide1Styles;