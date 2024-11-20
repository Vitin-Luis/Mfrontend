import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const coca = require('../assets/images/Coca-Cola-Emblema.png');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem vindo!!</Text>
      <View style={styles.imageContainer}>
        <Image source={coca} style={styles.placeholder} />
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          router.replace('/login');
        }}
      >
        <Text style={styles.buttonText}>Fazer Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => {
          router.replace('/register');
        }}
      >
        <Text style={styles.buttonText}>Criar Conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 50,
    color: 'white',
  },
  imageContainer: {
    marginBottom: 30,
  },
  placeholder: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  button: {
    width: 200,
    height: 50,
    backgroundColor: 'white', 
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginBottom: 10,
  },
  secondaryButton: {
    backgroundColor: 'white', 
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});
