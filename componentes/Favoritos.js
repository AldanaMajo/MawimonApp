import React, { useEffect, useState } from 'react';
import { View, Text, FlatList,Image,TouchableOpacity,StyleSheet,ActivityIndicator,Modal,Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Layout from './Layout';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function Favorito({ navigation }) {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPokemon, setLoadingPokemon] = useState(false);

  const typeColor = {
    fire: '#F08030', water: '#6890F0', grass: '#78C850', electric: '#F8D030',
    psychic: '#F85888', ice: '#98D8D8', dragon: '#7038F8', dark: '#705848',
    fairy: '#EE99AC', normal: '#A8A878', fighting: '#C03028', flying: '#A890F0',
    poison: '#A040A0', ground: '#E0C068', rock: '#B8A038', bug: '#A8B820',
    ghost: '#705898', steel: '#B8B8D0',
  };

  //  Cargar favoritos del almacenamiento
  const cargarFavoritos = async () => {
    try {
      const stored = await AsyncStorage.getItem('favoritos');
      setFavoritos(stored ? JSON.parse(stored) : []);
    } catch (err) {
      console.error('Error cargando favoritos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', cargarFavoritos);
    cargarFavoritos();
    return unsubscribe;
  }, [navigation]);

  //  Eliminar favorito
  const eliminarFavorito = async (id) => {
    const nuevos = favoritos.filter(p => p.id !== id);
    setFavoritos(nuevos);
    await AsyncStorage.setItem('favoritos', JSON.stringify(nuevos));
  };

  //  Abrir Pokémon
  const abrirPokemon = async (item) => {
    try {
      setLoadingPokemon(true);
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${item.id}`);
      const data = await res.json();
      navigation.navigate('PokemonDetail', { pokemon: data });
    } catch (err) {
      console.error('Error al cargar el Pokémon:', err);
    } finally {
      setLoadingPokemon(false);
    }
  };

  if (loading) {
    return (
          <Layout header="Favoritos" navigation={navigation} >
          <ActivityIndicator size="large" color="#666" />
          <Text>Cargando favoritos...</Text>
          </Layout>
    );
  }

  if (!favoritos.length) {
    return (

          <Layout header="Favoritos" navigation={navigation} >
          <Text style={styles.emptyText}>No tienes Pokémon favoritos aún :(</Text>
          </Layout>

    );
  }

  return (
    <Layout header="Favoritos" navigation={navigation} >
      
        {/* Modal de carga */}
        <Modal visible={loadingPokemon} transparent animationType="fade">
          <View style={styles.modalContainer}>
            <ActivityIndicator size="large" color="#666" />
          </View>
        </Modal>

        <FlatList
          data={favoritos}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
          renderItem={({ item }) => {
            const bgColor = typeColor[item.types[0]] || '#A8A878';
            return (
              <TouchableOpacity
                style={[styles.card, { backgroundColor: bgColor }]}
                activeOpacity={0.8}
                onPress={() => abrirPokemon(item)}
              >
                {/* Botón eliminar */}
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => eliminarFavorito(item.id)}
                >
                  <Icon name="trash" size={20} color="#fff" />
                </TouchableOpacity>

                <Image source={{ uri: item.image }} style={styles.image} />
                <Text style={styles.name}>{item.name.toUpperCase()}</Text>
                <View style={styles.typeContainer}>
                  {item.types.map((t) => (
                    <View
                      key={t}
                      style={[styles.typeBadge, { backgroundColor: typeColor[t] || '#999' }]}
                    >
                      <Text style={styles.typeText}>{t.toUpperCase()}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            );
          }}
        />
    
    </Layout>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  emptyContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  emptyText: { 
    fontSize: SCREEN_WIDTH * 0.045, 
    color: '#555' 
  },
  card: {
    flex: 1,
    margin: SCREEN_WIDTH * 0.02,
    borderRadius: 16,
    padding: SCREEN_WIDTH * 0.03,
    alignItems: 'center',
    elevation: 4,
    position: 'relative',
    minWidth: SCREEN_WIDTH * 0.42,
  },
  image: { 
    width: SCREEN_WIDTH * 0.32, 
    height: SCREEN_WIDTH * 0.32 
  },
  name: {
    fontWeight: 'bold',
    fontSize: SCREEN_WIDTH * 0.045,
    color: '#fff',
    marginTop: 6,
    textAlign: 'center',
  },
  typeContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'center', 
    marginTop: 6 
  },
  typeBadge: { 
    paddingHorizontal: 8, 
    paddingVertical: 2, 
    borderRadius: 12, 
    margin: 2 
  },
  typeText: { 
    color: '#fff', 
    fontSize: SCREEN_WIDTH * 0.033, 
    fontWeight: 'bold' 
  },
  deleteButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#ff4444',
    borderRadius: 12,
    padding: 4,
    zIndex: 2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#00000033',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
