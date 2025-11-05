import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, ScrollView, Image} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
export default function InicioPrincipal({ navigation }){
 return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor: '#3384cc' }} >
        
        <View style={styles.textoContainer}>
          <Text style={styles.title}>Bienvenido a: </Text>
        </View>
        <View style={styles.imgContainer}>
        <Image
          source={require('../assets/WIMAMON.png')}
          style={{ width: 150, height: 150, marginBottom: 30, resizeMode: 'contain' }}
        />
        </View>
    <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button} onPress={() => navigation.navigate('Registro')}
        >
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('InicioSesion')}>
            <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
        </TouchableOpacity>
    </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create ({
    button: {
    backgroundColor: '#0056b3',
    paddingVertical: 14,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
    marginTop: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
   buttonText: {
    color: '#080808ff',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.5,
  },
  textoContainer: {
    width: '100%',
    height: '25%',
    justifyContent: 'center',
    alignItems: 'right',
  },
  title: {
    margin: 50,
    fontSize: 24,
    fontFamily: 'pokemon',
  },
  buttonContainer: {
    width: '100%',
    height: '45%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ImageContainer: {
    width: '100%',
    height: '30%',
  },
  link: {
    marginTop: 15,
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});