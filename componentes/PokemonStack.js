import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Buscar from './Buscar'; // Tu pantalla de búsqueda
import PokemonDetail from './PokemonDetail'; // Nueva pantalla de detalles

const Stack = createNativeStackNavigator();

export default function PokemonStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Buscar" 
        component={Buscar} 
        options={{ title: 'Pokédex' }}
      />
      <Stack.Screen 
        name="PokemonDetail" 
        component={PokemonDetail} 
        options={({ route }) => ({ title: route.params.pokemon.name.toUpperCase() })}
      />
    </Stack.Navigator>
  );
}
