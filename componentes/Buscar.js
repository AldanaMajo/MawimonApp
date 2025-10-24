import { StyleSheet, View, Text, Button } from 'react-native';

import Layout from './Layout';

function Buscar({ navigation }) {
  return (
    <Layout header="Pokedex" navigation={navigation}>
      <Text>Bienvenido a la pantalla de buscar</Text>
    </Layout>
  );
}

const styles = StyleSheet.create({
 
});

export default Buscar;