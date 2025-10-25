import { View, Text, Image, StyleSheet, ScrollView, Animated, ActivityIndicator } from 'react-native';
import React, { useRef, useEffect, useState } from 'react';

export default function PokemonDetail({ route }) {
  const { pokemon } = route.params;
  const [weaknesses, setWeaknesses] = useState([]);
  const [loadingWeaknesses, setLoadingWeaknesses] = useState(true);

  const typeColor = {
    fire: '#F08030', water: '#6890F0', grass: '#78C850', electric: '#F8D030',
    psychic: '#F85888', ice: '#98D8D8', dragon: '#7038F8', dark: '#705848',
    fairy: '#EE99AC', normal: '#A8A878', fighting: '#C03028', flying: '#A890F0',
    poison: '#A040A0', ground: '#E0C068', rock: '#B8A038', bug: '#A8B820',
    ghost: '#705898', steel: '#B8B8D0',
  };

  const mainColor = typeColor[pokemon.types[0].type.name] || '#A8A878';

  // Animación de aparición de la imagen
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // 🔥 Obtener debilidades
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

  return (
    <ScrollView style={[styles.container, { backgroundColor: '#f7f7f7' }]}>
      {/* Encabezado */}
      <View style={[styles.header, { backgroundColor: mainColor }]}>
        <Animated.Image
          source={{ uri: pokemon.sprites.other['official-artwork'].front_default }}
          style={[styles.image, { opacity: fadeAnim }]}
          resizeMode="contain"
        />
        <Text style={styles.name}>{pokemon.name.toUpperCase()}</Text>
        <View style={styles.typeWrapper}>
          {pokemon.types.map(t => (
            <View key={t.type.name} style={[styles.typeBadge, { backgroundColor: typeColor[t.type.name] }]}>
              <Text style={styles.typeText}>{t.type.name.toUpperCase()}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Cuerpo */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Estadísticas base</Text>
        {pokemon.stats.map((s, i) => (
          <View key={i} style={styles.statRow}>
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

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Habilidades</Text>
        {pokemon.abilities.map(a => (
          <Text key={a.ability.name} style={styles.abilityText}>
            • {a.ability.name.charAt(0).toUpperCase() + a.ability.name.slice(1)}
          </Text>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Peso y Altura</Text>
        <Text style={styles.infoText}>Peso: {pokemon.weight / 10} kg</Text>
        <Text style={styles.infoText}>Altura: {pokemon.height / 10} m</Text>
      </View>

      {/* 💥 Debilidades */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Debilidades</Text>
        {loadingWeaknesses ? (
          <ActivityIndicator size="small" color={mainColor} />
        ) : (
          <View style={styles.typesContainer}>
            {weaknesses.length > 0 ? (
              weaknesses.map(w => (
                <View
                  key={w}
                  style={[
                    styles.typeBadgeWeakness,
                    { backgroundColor: typeColor[w] || '#999' },
                  ]}
                >
                  <Text style={styles.typeText}>{w.toUpperCase()}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.infoText}>Sin debilidades conocidas.</Text>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingVertical: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  image: { width: 220, height: 220 },
  name: { fontSize: 30, fontWeight: 'bold', color: '#fff', marginTop: 10 },
  typeWrapper: { flexDirection: 'row', marginTop: 10 },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  typeText: { color: '#fff', fontWeight: 'bold' },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  statRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  statName: { flex: 1, fontSize: 14, color: '#555' },
  progressBarBackground: {
    flex: 2,
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginHorizontal: 8,
  },
  progressBarFill: { height: 8, borderRadius: 8 },
  statValue: { width: 30, textAlign: 'right', color: '#444', fontWeight: 'bold' },
  abilityText: { fontSize: 16, marginVertical: 3, color: '#555' },
  infoText: { fontSize: 16, color: '#444', marginVertical: 2 },

  // 🌈 Mejor distribución de debilidades
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 8,
  },
  typeBadgeWeakness: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    margin: 6,
    minWidth: 70,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
});
