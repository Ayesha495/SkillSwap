import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#D9F5F6', 
  },
  text: {
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'serif',
    fontWeight: 'bold',
    color: '#00a0a9',
    position: 'absolute',
    top: 90,
    left: 20,
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: '#00a0a9',
    marginBottom: 20,
    padding: 12,
    fontSize: 13,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  button: {
    fontSize: 16,
    backgroundColor: '#00a0a9', 
    borderRadius: 25,
    width: 150,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    position: 'absolute',
    bottom: 120,
    left: 110,

    //For shadow effect
    shadowColor: '#00a0a9',
    shadowOpacity: 0.7,
    shadowRadius: 30,
    elevation: 10,

  },
  buttonText: {
    fontFamily: 'serif',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default styles;
