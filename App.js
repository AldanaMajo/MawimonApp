import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import { ActivityIndicator, View } from 'react-native';
import React from 'react';

// pantallas
import Inicio from './componentes/Inicio';
import MiniGame from './componentes/MiniGame';
import Buscar from './componentes/Buscar';
import Favoritos from './componentes/Favoritos';
import PokemonDetail from './componentes/PokemonDetail';
import Registro from './componentes/Registro';
import InicioSesion from './componentes/InicioSesion';
import InicioPrincipal from './componentes/InicioPrincipal';

const Stack = createNativeStackNavigator();

export default function App() {
  // 👇 carga ambas fuentes en una sola llamada
  const [fontsLoaded] = Font.useFonts({
    pokemon: require('./assets/Fonts/PokemonClassic.ttf'),
    TituloP: require('./assets/Fonts/Ketchum.otf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#092891" />
      </View>
    );
  }
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="InicioPrincipal">
           <Stack.Screen 
            name="InicioPrincipal" 
            component={InicioPrincipal}
             options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Inicio"
            component={Inicio}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Buscar" 
            component={Buscar}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="PokemonDetail" 
            component={PokemonDetail}
            options={({ route }) => ({
              title: route.params.pokemon.name.toUpperCase(),
            })}
          />
          <Stack.Screen 
            name="Favoritos" 
            component={Favoritos}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="MiniGame" 
            component={MiniGame}
            options={{ title: 'MiniGame', headerStyle: { backgroundColor: '#a3a2a2' } }}
          />
          <Stack.Screen 
            name="Registro" 
            component={Registro}
             options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="InicioSesion" 
            component={InicioSesion}
             options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer> 
    </SafeAreaProvider>
  );
}
