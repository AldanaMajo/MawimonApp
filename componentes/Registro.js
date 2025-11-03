import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

export default function Registro({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!nombre || !apellido || !email || !password) {
      Alert.alert('Campos vacíos', 'Por favor completa todos los campos.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: `${nombre} ${apellido}`,
      });

      await setDoc(doc(db, 'usuarios', user.uid), {
        nombre,
        apellido,
        email,
        creadoEn: new Date(),
      });

 
      Alert.alert('Éxito', 'Tu cuenta ha sido creada exitosamente.');
      setNombre('');
      setApellido('');
      setEmail('');
      setPassword('');

     
      setTimeout(() => {
        navigation.navigate('InicioSesion');
      }, 1000);

    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Este correo ya está registrado', 'Intenta iniciar sesión.');
        setNombre('');
        setApellido('');
        setEmail('');
        setPassword('');
      } else {
        Alert.alert('Error', error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Usuario</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={apellido}
        onChangeText={setApellido}
      />
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

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('InicioSesion')}>
        <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
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
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 28,
    marginBottom: 25,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 15,
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
    marginTop: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.5,
  },
  link: {
    marginTop: 18,
    color: '#007bff',
    fontSize: 15,
    fontWeight: '600',
  },
});
