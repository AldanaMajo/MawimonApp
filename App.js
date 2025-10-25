import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//pantallas
import Inicio from './componentes/Inicio';
import MiniGame from './componentes/MiniGame';
import Buscar from './componentes/Buscar';
import Favoritos from './componentes/Favoritos';
import PokemonDetail from './componentes/PokemonDetail'; // nueva pantalla
import Layout from './componentes/Layout';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Inicio">
        <Stack.Screen 
          name="Inicio"
          component={Inicio}
          options={{ title: 'Inicio' }}
        />
        <Stack.Screen 
        name="Buscar" component={Buscar}
        options={{title:'Buscar'}}
         />
         <Stack.Screen 
          name="PokemonDetail" 
          component={PokemonDetail}
          options={({ route }) => ({ title: route.params.pokemon.name.toUpperCase() })}
        />
         <Stack.Screen 
        name="Favoritos" component={Favoritos}
        options={{title:'Favoritos'}}
         />
        <Stack.Screen 
        name="MiniGame" component={MiniGame}
        options={{title:'MiniGame'}}
         />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;