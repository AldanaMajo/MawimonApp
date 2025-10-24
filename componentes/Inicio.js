import { StyleSheet, View, Text, Button } from 'react-native';

import Layout from './Layout';

function Inicio({ navigation }) {
  return (
    <Layout header="Jefes de Incursiones" navigation={navigation}>
      <Text>Bienvenido a la pantalla de Jefes de Incursiones</Text>
    </Layout>
  );
}

const styles = StyleSheet.create({
 
});

export default Inicio;