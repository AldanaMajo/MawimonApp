import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const IMAGE_SIZE = width * 0.3; // Imagen proporcional al ancho de la pantalla

export function PokemonCard({ url, navigation }) {
  const [pokemon, setPokemon] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(async data => {
        setPokemon(data);

        // Comprobar si ya está en favoritos
        const stored = await AsyncStorage.getItem('favoritos');
        const favoritos = stored ? JSON.parse(stored) : [];
        setIsFavorite(favoritos.some(p => p.id === data.id));
      })
      .catch(err => console.error(err));
  }, [url]);

  if (!pokemon)
    return (
      <SafeAreaProvider>
        <SafeAreaView style={[styles.container, styles.loadingContainer]}>
          <ActivityIndicator size="large" color="#fff" />
        </SafeAreaView>
      </SafeAreaProvider>
    );

  const typeColor = {
    fire: '#F08030', water: '#6890F0', grass: '#78C850', electric: '#F8D030',
    psychic: '#F85888', ice: '#98D8D8', dragon: '#7038F8', dark: '#705848',
    fairy: '#EE99AC', normal: '#A8A878', fighting: '#C03028', flying: '#A890F0',
    poison: '#A040A0', ground: '#E0C068', rock: '#B8A038', bug: '#A8B820',
    ghost: '#705898', steel: '#B8B8D0',
  };

  const bgColor = typeColor[pokemon.types[0].type.name] || '#A8A878';

  const toggleFavorite = async () => {
    try {
      const stored = await AsyncStorage.getItem('favoritos');
      let favoritos = stored ? JSON.parse(stored) : [];

      if (isFavorite) {
        favoritos = favoritos.filter(p => p.id !== pokemon.id);
      } else {
        favoritos.push({
          id: pokemon.id,
          name: pokemon.name,
          image: pokemon.sprites.other['official-artwork'].front_default,
          types: pokemon.types.map(t => t.type.name),
        });
      }

      await AsyncStorage.setItem('favoritos', JSON.stringify(favoritos));
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Error guardando favorito:', err);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity
          style={[styles.container, { backgroundColor: bgColor }]}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('PokemonDetail', { pokemon })}
        >
          {/*  Botón de favorito */}
          <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
            <Icon name={isFavorite ? 'heart' : 'heart-outline'} size={26} color="#fff" />
          </TouchableOpacity>

          {/*  Imagen del Pokémon */}
          <View style={[styles.imageContainer, { width: IMAGE_SIZE, height: IMAGE_SIZE }]}>
            <Image
              source={{ uri: pokemon.sprites.other['official-artwork'].front_default }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          {/*  Nombre */}
          <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
          </Text>

          {/*  Tipos */}
          <View style={styles.typesContainer}>
            {pokemon.types.map(t => (
              <View
                key={t.type.name}
                style={[styles.typeBadge, { backgroundColor: typeColor[t.type.name] || '#A8A878' }]}
              >
                <Text style={styles.typeText}>{t.type.name.toUpperCase()}</Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
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
    position: 'relative',
  },
  loadingContainer: {
    backgroundColor: '#ccc',
    justifyContent: 'center',
    height: 150,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 2,
  },
  imageContainer: {
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
    textAlign: 'center',
  },
});
