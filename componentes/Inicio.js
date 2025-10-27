import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import Layout from './Layout';

const PoGoApi = 'https://pogoapi.net/api/v1/raid_bosses.json';

function Inicio({ navigation }) {
  const [jefes, setJefes] = useState({}); 
  const [Loading, setLoading] = useState(true);
  const [nivelSelec, setNivelSelec] = useState("1");

  useEffect(() => {
    const fetchJefes = async () => {
      try {
        const respuesta = await fetch(PoGoApi);
        const datos = await respuesta.json();
        setJefes(datos);
      } catch (error) {
        console.error('Error al cargar jefes de incursiones:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJefes();
  }, []);

  if (Loading) {
    return (
      <Layout header="Jefes de Incursiones" navigation={navigation} style={styles.contenedor}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.Letra}>Cargando jefes...</Text>
      </Layout>
    );
  }

  const Incursiones = jefes.current?.[nivelSelec] || [];

  return (
    <Layout header="Jefes de Incursiones" navigation={navigation} style={styles.contenedor}>
      <Text style={styles.titulo}>Nivel {nivelSelec}</Text>

      {/* Botones para filtrar niveles */}
      <View style={styles.filtros}>
  {Object.keys(jefes.current || {})
    .filter((nivel) => (jefes.current?.[nivel]?.length ?? 0) > 0)
    .map((nivel) => (
      <TouchableOpacity
        key={nivel}
        style={[styles.boton, nivel === nivelSelec && styles.botonActivo]}
        onPress={() => setNivelSelec(nivel)}
      >
        <Text style={styles.textoBoton}>Nivel {nivel}</Text>
      </TouchableOpacity>
    ))}
</View>


      <FlatList style={styles.contenedor}
        data={Incursiones}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Detalles", { pokemon: item })}
          >
            <Text style={styles.nombre}>{item.name}</Text>
            <Text>Forma: {item.form}</Text>
            <Text>CP Máx (sin boost): {item.max_unboosted_cp}</Text>
            <Text>CP Máx (boosted): {item.max_boosted_cp}</Text>
            <Text>Shiny: {item.possible_shiny ? "Sí" : " No"}</Text>
          </TouchableOpacity>
        )}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  titulo: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  filtros: { flexDirection: "row", justifyContent: "space-around", marginVertical: 10 },
  boton: { padding: 10, backgroundColor: "#ddd", borderRadius: 8 },
  botonActivo: { backgroundColor: "#4CAF50" },
  textoBoton: { color: "#000", fontWeight: "bold" },
  contenedor: {
    flex: 1,
    padding: 16,
  },
  card: {
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
  },
  nombre: { fontSize: 16, fontWeight: "bold" },
});

export default Inicio;
