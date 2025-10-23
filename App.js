import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//pantallas
import Inicio from './componentes/Inicio';
import MiniGame from './componentes/MiniGame';


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
        name="MiniGame" component={MiniGame}
        options={{title:'MiniGame'}}
         />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;