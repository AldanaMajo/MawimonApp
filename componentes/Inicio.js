import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity, FlatList, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import Layout from './Layout';

const PoGoApi = 'https://pogoapi.net/api/v1/raid_bosses.json';

// Componentes
function IncursionCard({ item, navigation }) {
  const [pokemonData, setPokemonData] = useState(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${item.name.toLowerCase()}`);
        const data = await res.json();
        setPokemonData(data);
      } catch {
        console.log("No se pudo cargar el Pokémon:", item.name);
      }
    };
    fetchPokemon();
  }, [item.name]);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        if (pokemonData) {
          navigation.navigate('PokemonDetail', { pokemon: pokemonData });
        }
      }}
      disabled={!pokemonData} 
    >
      <View style={styles.cardContent}>
        {pokemonData ? (
          <Image
            source={{ uri: pokemonData.sprites.other['official-artwork'].front_default }}
            style={styles.imagen}
            resizeMode="contain"
          />
        ) : (
          <ActivityIndicator size="small" color="#aaa" />
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.nombre}>{item.name}</Text>
          <Text>Forma: {item.form || "Normal"}</Text>
          <Text>CP Máx: {item.max_unboosted_cp || "N/A"}</Text>
          <Text>Shiny: {item.possible_shiny ? "Sí " : "No"}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}


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

      <FlatList
        data={Incursiones}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <IncursionCard item={item} navigation={navigation} />}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  titulo: { 
    fontSize: 20, 
    fontWeight: "bold", 
    marginBottom: 10 
  },
  filtros: { 
    flexDirection: "row", 
    justifyContent: "space-around", 
    marginVertical: 10 
  },
  boton: { 
    padding: 10, 
    backgroundColor: "#ddd", 
    borderRadius: 8 
  },
  botonActivo: { 
    backgroundColor: "#4CAF50" 
  },
  textoBoton: { 
    color: "#000", 
    fontWeight: "bold" 
  },
  contenedor: { 
    flex: 1, 
    padding: 16 
  },
  card: { 
    padding: 12, 
    margin: 15, 
    borderWidth: 1, 
    borderColor: "#ccc", 
    borderRadius: 10 
  },
  nombre: { 
    fontSize: 16, 
    fontWeight: "bold" 
  },
  cardContent: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    margin: 2,
    },
  imagen: { 
    width: 80, 
    height: 80, 
    marginRight: 10 
  },
});

export default Inicio;
