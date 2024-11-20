import { Image, StyleSheet, TextInput, View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function Register() {
  const router = useRouter();
  const coca = require('../../assets/images/Coca-Cola-Emblema.png');
  const [data, setData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (name: string, value: string) => {
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (
      !data.name.trim() ||
      !data.email.trim() ||
      !data.password.trim() ||
      !data.confirmPassword.trim()
    ) {
      alert('Por favor, preencha todos os campos!');
      return;
    }
  
    if (data.password !== data.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }
  
    setIsLoading(true);
  
    try {
      const response = await fetch('http://localhost:3000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          confirmarSenha: data.confirmPassword, // Certifique-se que o nome coincide com o backend
        }),
      });
  
      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(errorMessage.message || 'Erro ao registrar. Tente novamente.');
      }
  
      alert('Registro realizado com sucesso!');
      router.replace('/login');
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Algo deu errado, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <Image source={coca} style={styles.logo} />
      <View style={styles.formContainer}>
        <Text style={styles.heading}>Crie sua conta</Text>
        <TextInput
          placeholder="Digite seu nome"
          value={data.name}
          onChangeText={(value) => handleChange('name', value)}
          style={styles.input}
        />
        <TextInput
          placeholder="Digite seu email"
          value={data.email}
          onChangeText={(value) => handleChange('email', value)}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Digite sua senha"
          value={data.password}
          onChangeText={(value) => handleChange('password', value)}
          secureTextEntry
          style={styles.input}
        />
        <TextInput
          placeholder="Confirme sua senha"
          value={data.confirmPassword}
          onChangeText={(value) => handleChange('confirmPassword', value)}
          secureTextEntry
          style={styles.input}
        />
        <TouchableOpacity
          onPress={handleSubmit}
          style={[styles.button, isLoading && styles.disabledButton]}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Registrando...' : 'Registrar'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.replace('/login')} style={styles.button}>
        <Text style={styles.buttonText}>Já tem uma conta? Faça login</Text>
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
    padding: 20,
  },
  logo: {
    height: 200,
    width: 200,
  },
  formContainer: {
    height: 350,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: {
    color: 'white',
    fontSize: 30,
    marginBottom: 10,
  },
  input: {
    height: 45,
    width: 250,
    borderRadius: 10,
    backgroundColor: 'white',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  button: {
    height: 45,
    width: 250,
    borderRadius: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});
