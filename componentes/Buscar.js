import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useState, useEffect } from 'react';
import { PokemonCard } from './PokemonCard';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { Ionicons as Icons } from '@expo/vector-icons';
import Layout from './Layout';

const HeaderNav = () => (
  <View style={styles.headerNav}>
   
    <TouchableOpacity style={styles.iconoU}>
    <Icons name="person-circle-outline" size={40} color="#000" />
    </TouchableOpacity>

  </View>
);

function Buscar({ navigation }) {
  const [pokemon, setPokemon] = useState([]);
  const [next, setNext] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState('');

  // Cargar lista 
  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon/')
      .then(res => res.json())
      .then(data => {
        setPokemon(data.results);
        setNext(data.next);
      })
      .catch(error => console.error('Error al cargar Pokémon:', error));
  }, []);

  // Cargar más
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

  // Buscar Pokémon por nombre
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
  useEffect(() => {
  const timeout = setTimeout(() => handleSearch(), 600);
  return () => clearTimeout(timeout);
}, [searchText]);


  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <HeaderNav/>
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

        <FlatList
          data={searchResult || pokemon}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          renderItem={({ item }) => (
            <PokemonCard url={item.url} navigation={navigation} />
          )}
          numColumns={2}
          columnWrapperStyle={styles.row}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            isLoadingMore && !searchResult ? (
              <ActivityIndicator size="large" color="#000" />
            ) : null
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
   headerNav: {
    height: 60,
    backgroundColor: '#a3a2a2',
    flexDirection: 'row',       
    justifyContent: 'flex-end',  
    alignItems: 'center', 
    paddingHorizontal: 15,
},
iconoU: {
  justifyContent: 'center',
  alignItems: 'center',
},
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 8,
  },
  row: {
    justifyContent: 'space-around',
  },
});

export default Buscar;
