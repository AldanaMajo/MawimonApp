import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image, ScrollView 
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets, SafeAreaProvider } from 'react-native-safe-area-context';

export default function InicioPrincipal({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ImageBackground
          source={require('../assets/InicioPrinci.png')}
          style={styles.background}
          resizeMode="cover"
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 20,
              paddingTop: insets.top + 10,
              paddingBottom: insets.bottom + 40,
            }}
          >
            <View style={styles.container}>
              <View style={styles.textoContainer}>
                <Text style={styles.title}>Bienvenido a:</Text>
              </View>

              <View style={styles.imgContainer}>
                <Image
                  source={require('../assets/WIMAMON.png')}
                  style={{
                    width: 300,
                    height: 300,
                    resizeMode: 'contain',
                  }}
                />
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => navigation.navigate('Registro')}
                >
                  <Text style={styles.buttonText}>Registrarse</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('InicioSesion')}>
                  <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
    </SafeAreaProvider>
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
    maxWidth: 440,
    backgroundColor: 'rgba(0,0,0,0.25)',
    paddingVertical: 120,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  imgContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 25,
    width: '100%',
  },
  button: {
    backgroundColor: '#0056b3',
    paddingVertical: 20,
    borderRadius: 14,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18, 
    letterSpacing: 0.9,
  },
  link: {
    marginTop: 15,
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
