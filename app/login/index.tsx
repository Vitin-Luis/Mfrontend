import { Image, StyleSheet, TextInput, View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type FormData = {
  email: string;
  password: string;
};

export default function Login() {
  const router = useRouter();
  const coca = require('../../assets/images/Coca-Cola-Emblema.png');
  const [data, setData] = useState<FormData>({
    email: '',
    password: '',
  });

  // Atualiza os dados do formulário
  const handleChange = (name: string, value: string) => {
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Envia os dados para o backend
  const handleSubmit = async () => {
    console.log('handleSubmit chamado');
  
    if (!data.email.trim() || !data.password.trim()) {
      console.log('Campos vazios detectados.');
      alert('Campos vazios detectados');
      return;
    }
  
    try {
      console.log('Enviando dados para o servidor:', data);
  
      const response = await fetch('http://localhost:3000/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      console.log('Resposta do servidor:', response);
  
      const result = await response.json();
      console.log('Dados do servidor:', result);
  
      if (response.ok) {
        const { user } = result;
  
        if (user?.token) {
          console.log('Token recebido:', user.token);
          await AsyncStorage.setItem('@authToken', user.token);
          await AsyncStorage.setItem('@authorId', user.id);
          await AsyncStorage.setItem('@authorName', user.name);
          router.push('/home');

        } else {
          Alert.alert('Erro', 'Token não recebido.');
        }
      } else {
        console.log('Erro no servidor:', result.message);
        Alert.alert('Erro', result.message || 'Erro ao fazer login.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
    }
  };
  
  

  return (
    <View style={styles.container}>
      <Image source={coca} style={styles.logo} />
      <View style={styles.formContainer}>
        <Text style={styles.heading}>Faça seu login</Text>
        <TextInput
          placeholder="Digite seu email"
          value={data.email}
          onChangeText={(value) => handleChange('email', value)}
          style={styles.input}
        />
        <TextInput
          placeholder="Digite sua senha"
          value={data.password}
          onChangeText={(value) => handleChange('password', value)}
          secureTextEntry
          style={styles.input}
        />
        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.replace('/register')} style={styles.button}>
        <Text style={styles.buttonText}>Criar conta</Text>
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
    height: 250,
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
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});
