import { StyleSheet, View, Text, Button } from 'react-native';

import Layout from './Layout';

function Inicio({ navigation }) {
  return (
    <Layout header="Jefes de Incursiones" navigation={navigation}>
      <Text style={styles.Letra}>Bienvenido a la pantalla de Jefes de Incursiones</Text>
    </Layout>
  );
}

const styles = StyleSheet.create({
  Letra: {
    fontSize: 18,
    color: '#000',
  },
});


export default Inicio;