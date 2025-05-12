import { StyleSheet } from 'react-native';

const LoginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBF8EF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#00a0a9',
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 20,
    color: '#00a0a9',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#00a0a9',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  link: {
    marginTop: 20,
    color: '#00a0a9',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default LoginStyles;