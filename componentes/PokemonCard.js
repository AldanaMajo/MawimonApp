import { Text, View, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';

export function PokemonCard({ url, navigation }) {
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => setPokemon(data))
      .catch(err => console.error(err));
  }, [url]);

  if (!pokemon)
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );

  const typeColor = {
    fire: '#F08030', water: '#6890F0', grass: '#78C850', electric: '#F8D030',
    psychic: '#F85888', ice: '#98D8D8', dragon: '#7038F8', dark: '#705848',
    fairy: '#EE99AC', normal: '#A8A878', fighting: '#C03028', flying: '#A890F0',
    poison: '#A040A0', ground: '#E0C068', rock: '#B8A038', bug: '#A8B820',
    ghost: '#705898', steel: '#B8B8D0',
  };

  const bgColor = typeColor[pokemon.types[0].type.name] || '#A8A878';

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: bgColor }]}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('PokemonDetail', { pokemon })}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: pokemon.sprites.other['official-artwork'].front_default }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
        {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
      </Text>
      <View style={styles.typesContainer}>
        {pokemon.types.map(t => (
          <View key={t.type.name} style={[styles.typeBadge, { backgroundColor: typeColor[t.type.name] || '#A8A878' }]}>
            <Text style={styles.typeText}>{t.type.name.toUpperCase()}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  loadingContainer: {
    backgroundColor: '#ccc',
    justifyContent: 'center',
    height: 150,
  },
  imageContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  name: {
    marginTop: 8,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  typesContainer: {
    flexDirection: 'row',
    marginTop: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    margin: 2,
  },
  typeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
});
