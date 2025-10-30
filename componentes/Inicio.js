import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity, FlatList, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import Layout from './Layout';

const PoGoApi = 'https://pogoapi.net/api/v1/raid_bosses.json';

// Colores por tipo
const typeColor = {
  fire: '#F08030', water: '#6890F0', grass: '#78C850', electric: '#F8D030',
  psychic: '#F85888', ice: '#98D8D8', dragon: '#7038F8', dark: '#705848',
  fairy: '#EE99AC', normal: '#A8A878', fighting: '#C03028', flying: '#A890F0',
  poison: '#A040A0', ground: '#E0C068', rock: '#B8A038', bug: '#A8B820',
  ghost: '#705898', steel: '#B8B8D0',
};

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

  // Color de fondo por tipo
  const bgColor = pokemonData ? typeColor[pokemonData.types[0].type.name] || '#A8A878' : 'rgba(245,245,245,0.03)';

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: bgColor }]}
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
        <Text style={styles.nombre}>{item.name}</Text>
        <View style={styles.contTexto}>
          <Text style={styles.texto}>Forma: {item.form || "Normal"}</Text>
          <Text style={styles.texto}>CP Máx: {item.max_unboosted_cp || "N/A"}</Text>
          <Text style={styles.texto}>Shiny: {item.possible_shiny ? "Sí" : "No"}</Text>
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
              <Text style={[styles.textoBoton, nivel === nivelSelec && styles.btnTextAct]}>Nivel {nivel}</Text>
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
  filtros: { 
    flexDirection: "row", 
    justifyContent: "space-around", 
    marginVertical: 10,
    backgroundColor: "#f4db72",
    padding: 10,
  },
  boton: { 
    padding: 5, 
    paddingLeft:15,
    paddingRight: 15,
    backgroundColor: "#3384cc", 
    borderRadius: 10 
  },
  botonActivo: { 
    backgroundColor: "#161943" ,
  },
  textoBoton: { 
    color: "#000", 
    fontWeight: "bold" ,
  },
  btnTextAct:{
    color : "#fff",
    fontWeight: "bold",
  },
  contenedor: { 
    flex: 1, 
    padding: 16 
  },
  card: { 
    flex: 1,
    margin: 10,
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
    shadowColor: 'rgba(151, 142, 142, 0)',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 7,
    elevation: 10,
    position: 'relative',
    borderColor:'#79747e',
    borderWidth: 0.5,
  },
  nombre: { 
    fontSize: 16, 
    fontWeight: "bold", 
    fontFamily: 'pokemon',
    textAlign: 'center',
    color: '#fff',
  },
  cardContent: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    margin: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  imagen: { 
    width: 100, 
    height: 100, 
  },
  texto: {
    flexDirection: 'row', 
    margin: 5,
    backgroundColor: 'rgba(255,255,255,0.3)',
    padding: 5,
    borderRadius: 10,
    textAlign: 'center',
    color: '#000',
  },
  contTexto:{
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'center', 
    marginTop: 6 
  },
});

export default Inicio;
