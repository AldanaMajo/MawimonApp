import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//pantallas
import Inicio from './componentes/Inicio';


const pantallas = createNativeStackNavigator();

function App() {
    return (
        <NavigationContainer>
            <pantallas.Navigator initialRouteName="Inicio">
              
                <pantallas.Screen 
                    name="Inicio"
                    component={Inicio}
                    options={{ title: 'Inicio' }}
                />
               
            </pantallas.Navigator>
        </NavigationContainer>
    );
}

export default App;