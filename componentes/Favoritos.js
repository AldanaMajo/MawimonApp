import { StyleSheet, View, Text, Button } from 'react-native';

import Layout from './Layout';

function Favoritos({ navigation }) {
  return (
    <Layout header="Favoritos" navigation={navigation}>
      <Text>Bienvenido a la pantalla de Favoritos</Text>
    </Layout>
  );
}

const styles = StyleSheet.create({
 
});

export default Favoritos;