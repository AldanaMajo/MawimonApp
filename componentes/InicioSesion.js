import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Inicio de sesión exitoso ✅');
      navigation.navigate('Inicio');
    } catch (error) {
      Alert.alert('Error', 'Correo o contraseña incorrectos');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Registro')}>
        <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#f5f7fa',
  },
  title: {
    fontSize: 28,
    marginBottom: 25,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d0d0d0',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#333',
    elevation: 2, 
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 5,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.4,
  },
  link: {
    marginTop: 18,
    color: '#007bff',
    fontWeight: '600',
    fontSize: 15,
    textAlign: 'center',
  },
});

