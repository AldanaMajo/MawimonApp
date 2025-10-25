import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useState, useEffect } from 'react';
import { PokemonCard } from './PokemonCard'; // Ajusta la ruta
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

function Buscar({ navigation }) {
  const [pokemon, setPokemon] = useState([]);
  const [next, setNext] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon/')
      .then(res => res.json())
      .then(data => {
        setPokemon(data.results);
        setNext(data.next);
      })
      .catch(error => console.error('Error al cargar Pokémon:', error));
  }, []);

  const loadMore = () => {
    if (isLoadingMore || !next) return;

    setIsLoadingMore(true);

    fetch(next)
      .then(res => res.json())
      .then(data => {
        setPokemon(prev => [...prev, ...data.results]);
        setNext(data.next);
      })
      .catch(error => console.error('Error al cargar más Pokémon:', error))
      .finally(() => setIsLoadingMore(false));
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <FlatList
          data={pokemon}
          keyExtractor={(item, index) => `${item.name}-${index}`} // Evita duplicados
          renderItem={({ item }) => (
            <PokemonCard 
              url={item.url} 
              navigation={navigation} // 👈 Pasamos navegación
            />
          )}
          numColumns={2} // Grid
          columnWrapperStyle={styles.row}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            isLoadingMore ? <ActivityIndicator size="large" color="#000" /> : null
          }
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 16,
  },
  row: {
    justifyContent: 'space-around',
  },
});

export default Buscar;
