import { StatusBar } from 'expo-status-bar';
import { StyleSheet, FlatList, ActivityIndicator, TextInput, View, Text, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { PokemonCard } from './PokemonCard';
import { LinearGradient } from 'expo-linear-gradient';
import Layout from './Layout';
import Icon from 'react-native-vector-icons/Ionicons';

function Buscar({ navigation }) {
  const [pokemon, setPokemon] = useState([]);
  const [next, setNext] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState('');

  // 🔹 Cargar los primeros 20 Pokémon
  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=20&offset=0')
      .then(res => res.json())
      .then(data => {
        setPokemon(data.results);
        setNext(data.next);
      })
      .catch(error => console.error('Error al cargar Pokémon:', error));
  }, []);

  // 🔹 Cargar más Pokémon (otros 20)
  const loadMore = () => {
    if (isLoadingMore || !next || isSearching) return;
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

  // 🔹 Buscar Pokémon por nombre
  const handleSearch = async () => {
    if (!searchText.trim()) {
      setIsSearching(false);
      setSearchResult(null);
      setError('');
      return;
    }

    setIsSearching(true);
    setError('');
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchText.toLowerCase()}`);
      if (!res.ok) throw new Error('No encontrado');
      const data = await res.json();
      setSearchResult([{ name: data.name, url: `https://pokeapi.co/api/v2/pokemon/${data.id}/` }]);
    } catch (err) {
      setError('Pokémon no encontrado');
      setSearchResult(null);
    } finally {
      setIsSearching(false);
    }
  };

  // 🔹 Buscar automáticamente mientras escribe (debounce)
  useEffect(() => {
    const timeout = setTimeout(() => handleSearch(), 600);
    return () => clearTimeout(timeout);
  }, [searchText]);

  return (
    <Layout header="Pokédex" navigation={navigation}>
      <LinearGradient colors={['#b3e5fc', '#e1f5fe', '#ffffff']} style={styles.gradient}>
        {/* Buscador */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Buscar Pokémon"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity style={styles.iconContainer} onPress={handleSearch}>
            <Icon name="search" size={22} color="#092891ff" />
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Lista de Pokémon */}
        <FlatList
          data={searchResult || pokemon}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          renderItem={({ item }) => (
            <PokemonCard url={item.url} navigation={navigation} />
          )}
          numColumns={2}
          columnWrapperStyle={styles.row}
          ListFooterComponent={() => (
            !isSearching && !searchResult ? (
              <View style={styles.footer}>
                {isLoadingMore ? (
                  <ActivityIndicator size="large" color="#092891ff" />
                ) : (
                  next && (
                    <TouchableOpacity style={styles.loadMoreBtn} onPress={loadMore}>
                      <Text style={styles.loadMoreText}>Cargar más</Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            ) : null
          )}
        />
      </LinearGradient>
    </Layout>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  searchContainer: {
    position: "relative",
    margin: 10,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 40,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#092891ff",
  },
  iconContainer: {
    position: "absolute",
    right: 15,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 8,
  },
  row: {
    justifyContent: 'space-around',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadMoreBtn: {
    backgroundColor: '#092891ff',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  loadMoreText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Buscar;
