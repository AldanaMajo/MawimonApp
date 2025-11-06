import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const IMAGE_SIZE = width * 0.5; // Imagen ocupando el 50% del ancho
const BADGE_MIN_WIDTH = 60;

export default function PokemonDetail({ route }) {
  const { pokemon } = route.params;
  const [weaknesses, setWeaknesses] = useState([]);
  const [loadingWeaknesses, setLoadingWeaknesses] = useState(true);
  const [recommended, setRecommended] = useState([]);
  const [loadingRecommended, setLoadingRecommended] = useState(true);

  const typeColors = {
    fire: '#F08030', water: '#6890F0', grass: '#78C850', electric: '#F8D030',
    psychic: '#F85888', ice: '#98D8D8', dragon: '#7038F8', dark: '#705848',
    fairy: '#EE99AC', normal: '#A8A878', fighting: '#C03028', flying: '#A890F0',
    poison: '#A040A0', ground: '#E0C068', rock: '#B8A038', bug: '#A8B820',
    ghost: '#705898', steel: '#B8B8D0',
  };

  const mainColor = typeColors[pokemon.types[0].type.name] || '#A8A878';

  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // === Cargar debilidades ===
  useEffect(() => {
    const fetchWeaknesses = async () => {
      try {
        const weaknessesSet = new Set();
        for (const t of pokemon.types) {
          const res = await fetch(`https://pokeapi.co/api/v2/type/${t.type.name}`);
          const data = await res.json();
          data.damage_relations.double_damage_from.forEach(w => weaknessesSet.add(w.name));
        }
        setWeaknesses([...weaknessesSet]);
      } catch (err) {
        console.error('Error al cargar debilidades:', err);
      } finally {
        setLoadingWeaknesses(false);
      }
    };
    fetchWeaknesses();
  }, [pokemon]);

  // === Cargar Pokémon recomendados ===
  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        if (weaknesses.length === 0) return;

        const randomWeaknesses = weaknesses.slice(0, 3); // Tomar hasta 3 tipos débiles
        const pokemonsSet = new Set();
        const results = [];

        for (const type of randomWeaknesses) {
          const res = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
          const data = await res.json();
          const strongPokemons = data.pokemon.slice(0, 10); // Tomamos 10 pokémon por tipo
          for (const p of strongPokemons) {
            pokemonsSet.add(p.pokemon.name);
          }
        }

        const uniquePokemons = Array.from(pokemonsSet)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);

        for (const name of uniquePokemons) {
          const pokeRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
          const pokeData = await pokeRes.json();
          results.push({
            name: pokeData.name,
            types: pokeData.types.map(t => t.type.name),
            image: pokeData.sprites.other['official-artwork'].front_default,
          });
        }

        setRecommended(results);
      } catch (err) {
        console.error('Error al obtener recomendados:', err);
      } finally {
        setLoadingRecommended(false);
      }
    };

    fetchRecommended();
  }, [weaknesses]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f7f7f7' }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          {/* Header */}
          <View style={[styles.header, { backgroundColor: mainColor }]}>
            <Animated.Image
              source={{ uri: pokemon.sprites.other['official-artwork'].front_default }}
              style={[styles.image, { opacity: fadeAnim }]}
            />
            <Text style={styles.name}>{pokemon.name.toUpperCase()}</Text>
            <View style={styles.typeContainer}>
              {pokemon.types.map(t => (
                <View
                  key={t.type.name}
                  style={[styles.typeBadge, { backgroundColor: typeColors[t.type.name], minWidth: BADGE_MIN_WIDTH }]}
                >
                  <Text style={styles.typeText}>{t.type.name.toUpperCase()}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Estadísticas */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Estadísticas base</Text>
            {pokemon.stats.map(s => (
              <View key={s.stat.name} style={styles.statRow}>
                <Text style={styles.statName}>{s.stat.name.toUpperCase()}</Text>
                <View style={styles.progressBarBackground}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${Math.min(s.base_stat, 100)}%`, backgroundColor: mainColor },
                    ]}
                  />
                </View>
                <Text style={styles.statValue}>{s.base_stat}</Text>
              </View>
            ))}
          </View>

          {/* Habilidades */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Habilidades</Text>
            <View style={styles.typeContainer}>
              {pokemon.abilities.map(a => (
                <View key={a.ability.name} style={styles.skillBadge}>
                  <Text style={styles.skillText}>{a.ability.name.toUpperCase()}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Peso y Altura */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Peso y Altura</Text>
            <Text style={styles.text}>Peso: {(pokemon.weight / 10).toFixed(1)} kg</Text>
            <Text style={styles.text}>Altura: {(pokemon.height / 10).toFixed(1)} m</Text>
          </View>

          {/* Debilidades */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Debilidades</Text>
            {loadingWeaknesses ? (
              <ActivityIndicator size="small" color={mainColor} />
            ) : (
              <View style={styles.typeContainer}>
                {weaknesses.length > 0 ? (
                  weaknesses.map(w => (
                    <View
                      key={w}
                      style={[styles.typeBadge, { backgroundColor: typeColors[w] || '#999', minWidth: BADGE_MIN_WIDTH }]}
                    >
                      <Text style={styles.typeText}>{w.toUpperCase()}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.text}>Sin debilidades conocidas.</Text>
                )}
              </View>
            )}
          </View>

          {/* Pokémon recomendados */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pokémon recomendados</Text>
            {loadingRecommended ? (
              <ActivityIndicator size="small" color={mainColor} />
            ) : recommended.length > 0 ? (
              <View style={styles.recommendedContainer}>
                {recommended.map((r) => (
                  <View key={r.name} style={styles.recommendedCard}>
                    <Image source={{ uri: r.image }} style={styles.recommendedImage} />
                    <Text style={styles.recommendedName}>{r.name.toUpperCase()}</Text>
                    <View style={styles.typeContainer}>
                      {r.types.map((t) => (
                        <View
                          key={t}
                          style={[styles.typeBadge, { backgroundColor: typeColors[t] || '#999' }]}
                        >
                          <Text style={styles.typeText}>{t.toUpperCase()}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.text}>No se encontraron recomendaciones.</Text>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  image: { width: IMAGE_SIZE, height: IMAGE_SIZE, resizeMode: 'contain' },
  name: { fontSize: 26, fontWeight: 'bold', color: '#fff', marginVertical: 8 },
  typeContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  typeBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    margin: 3,
  },
  typeText: { color: '#fff', fontWeight: 'bold', fontSize: 13, textAlign: 'center' },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 10,
    borderRadius: 16,
    padding: 15,
    elevation: 2,
  },
  sectionTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 8, color: '#333' },
  statRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 3 },
  statName: { flex: 1, color: '#444', fontWeight: 'bold', fontSize: 13 },
  statValue: { width: 30, textAlign: 'right', color: '#000', fontWeight: '600', fontSize: 13 },
  progressBarBackground: {
    flex: 2,
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginHorizontal: 8,
  },
  progressBarFill: { height: 8, borderRadius: 8 },
  skillBadge: {
    backgroundColor: '#eee',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 3,
    minWidth: BADGE_MIN_WIDTH,
    alignItems: 'center',
  },
  skillText: { color: '#333', fontWeight: 'bold', fontSize: 12, textAlign: 'center' },
  text: { fontSize: 14, color: '#444', marginVertical: 2 },

  // --- Estilos recomendados ---
  recommendedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  recommendedCard: {
    alignItems: 'center',
    backgroundColor: '#fefefe',
    borderRadius: 14,
    padding: 10,
    margin: 5,
    width: width * 0.42,
    elevation: 3,
  },
  recommendedImage: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
  },
  recommendedName: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
});
