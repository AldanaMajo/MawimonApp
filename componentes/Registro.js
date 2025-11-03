import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ImageBackground,
  ScrollView,
  Dimensions
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

const { width, height } = Dimensions.get('window');

export default function Registro({ navigation }) {
  const insets = useSafeAreaInsets();
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

      await updateProfile(user, { displayName: `${nombre} ${apellido}` });
      await setDoc(doc(db, 'usuarios', user.uid), { nombre, apellido, email, creadoEn: new Date() });

      Alert.alert('Éxito', 'Tu cuenta ha sido creada exitosamente.');
      setNombre(''); setApellido(''); setEmail(''); setPassword('');

      setTimeout(() => navigation.navigate('InicioSesion'), 1000);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Este correo ya está registrado', 'Intenta iniciar sesión.');
      } else {
        Alert.alert('Error', error.message);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <ImageBackground 
        source={require('../assets/Registro.png')} 
        style={styles.background} 
        resizeMode="cover"
      >
        <ScrollView 
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 30,
            paddingTop: insets.top + 10, // franja segura arriba
            paddingBottom: insets.bottom + 20, // franja segura abajo
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <Text style={styles.title}>Registro de Usuario</Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre"
              placeholderTextColor="#e1e5ee"
              value={nombre}
              onChangeText={setNombre}
            />
            <TextInput
              style={styles.input}
              placeholder="Apellido"
              placeholderTextColor="#e1e5ee"
              value={apellido}
              onChangeText={setApellido}
            />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#e1e5ee"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#e1e5ee"
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
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: 'rgba(0,0,0,0.35)',
    padding: 20,
    borderRadius: 20,
  },
  title: {
    fontSize: 26,
    marginBottom: 25,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
    color: '#fff',
  },
  button: {
    backgroundColor: '#0056b3',
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.5,
  },
  link: {
    marginTop: 18,
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
