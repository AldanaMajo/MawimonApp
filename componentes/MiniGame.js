import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SafeAreaView,
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

const POKEMON_SPRITES = {
  caterpie: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10.png',
  weedle: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/13.png',
  wurmple: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/265.png',
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_COLS = 8;
const GRID_ROWS = 8;
const GAME_AREA_WIDTH = SCREEN_WIDTH * 0.8;
const GAME_AREA_HEIGHT = GAME_AREA_WIDTH; // cuadrado
const CELL_SIZE = GAME_AREA_WIDTH / GRID_COLS;

const INITIAL_SPEED = 250; // velocidad inicial más lenta
const STORAGE_KEY_BEST = '@pokemon_snake_best_score';

const randPos = () => ({
  x: Math.floor(Math.random() * GRID_COLS),
  y: Math.floor(Math.random() * GRID_ROWS),
});
const positionsEqual = (a, b) => a.x === b.x && a.y === b.y;

export default function MiniGame() {
  const [screen, setScreen] = useState('menu');
  const [selected, setSelected] = useState('caterpie');
  const [snake, setSnake] = useState([]);
  const [direction, setDirection] = useState('RIGHT');
  const [food, setFood] = useState(randPos());
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [countdown, setCountdown] = useState(null);

  const intervalRef = useRef(null);
  const dirRef = useRef(direction);
  dirRef.current = direction;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    (async () => {
      try {
        const v = await AsyncStorage.getItem(STORAGE_KEY_BEST);
        if (v) setBest(parseInt(v, 10));
      } catch (e) { console.log('Error loading best', e); }
    })();
    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => { if (running) startLoop(); else stopLoop(); return () => stopLoop(); }, [running, speed]);

  const startGame = (starterPokemon) => {
    setSelected(starterPokemon || selected);
    const startPos = { x: Math.floor(GRID_COLS / 2), y: Math.floor(GRID_ROWS / 2) };
    setSnake([startPos, { x: startPos.x - 1, y: startPos.y }, { x: startPos.x - 2, y: startPos.y }]);
    setDirection('RIGHT');
    setFood(generateFood([startPos]));
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setScreen('game');
    setCountdown(3);

    let count = 3;
    const timer = setInterval(() => {
      count--;
      setCountdown(count);
      if (count <= 0) { clearInterval(timer); setCountdown(null); setRunning(true); }
    }, 1000);
  };

  const gameOver = async () => {
    setRunning(false);
    setScreen('gameover');
    try {
      if (score > best) { await AsyncStorage.setItem(STORAGE_KEY_BEST, String(score)); setBest(score); }
    } catch (e) { console.log('Error saving best', e); }
  };

  const startLoop = () => { stopLoop(); intervalRef.current = setInterval(() => step(), speed); };
  const stopLoop = () => { if (intervalRef.current) clearInterval(intervalRef.current); intervalRef.current = null; };

  const changeDir = (newDir) => { const opposite = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' }; if (opposite[newDir] === dirRef.current) return; setDirection(newDir); };

  const generateFood = (currentSnake) => {
    let p = randPos(); let tries = 0;
    while (currentSnake.some((s) => positionsEqual(s, p)) && tries < 200) { p = randPos(); tries++; }
    return p;
  };

  const step = () => {
    setSnake((old) => {
      const head = { ...old[0] };
      const dir = dirRef.current;
      if (dir === 'UP') head.y -= 1; else if (dir === 'DOWN') head.y += 1;
      else if (dir === 'LEFT') head.x -= 1; else if (dir === 'RIGHT') head.x += 1;

      if (head.x < 0 || head.x >= GRID_COLS || head.y < 0 || head.y >= GRID_ROWS) { gameOver(); return old; }

      for (let i = 0; i < old.length; i++) if (positionsEqual(head, old[i])) { gameOver(); return old; }

      let newSnake = [head, ...old.slice(0, old.length - 1)];
      if (positionsEqual(head, food)) { newSnake = [head, ...old]; setFood(generateFood(newSnake)); setScore((s) => s + 1); setSpeed((s) => Math.max(60, s - 5)); }

      return newSnake;
    });
  };

  const renderCell = (x, y) => {
    const isHead = snake.length > 0 && positionsEqual(snake[0], { x, y });
    const isBody = snake.some((p, idx) => idx > 0 && positionsEqual(p, { x, y }));
    const isFood = positionsEqual(food, { x, y });

    if (isHead) return (
      <View key={`${x}-${y}`} style={[styles.cell, styles.cellHead]}>
        <Image source={{ uri: POKEMON_SPRITES[selected] }} style={styles.pokemonImage} />
      </View>
    );
    if (isBody) return (
      <View key={`${x}-${y}`} style={[styles.cell, styles.cellBody]}>
        <Image source={{ uri: POKEMON_SPRITES[selected] }} style={styles.pokemonImageSmall} />
      </View>
    );
    if (isFood) return (
      <View key={`${x}-${y}`} style={[styles.cell, styles.cellFood]}>
        <Text style={{ fontSize: CELL_SIZE * 0.5 }}>🍓</Text>
      </View>
    );
    return <View key={`${x}-${y}`} style={styles.cell} />;
  };

  // -------------------- PANTALLA MENÚ --------------------
  if (screen === 'menu') {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <Text style={styles.title}>Poké-Snake</Text>
          <Text style={styles.subtitle}>Elige tu Pokémon</Text>

          <ScrollView
            horizontal
            contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 10 }}
            showsHorizontalScrollIndicator={false}
          >
            {Object.keys(POKEMON_SPRITES).map((k) => (
              <TouchableOpacity
                key={k}
                style={[styles.pokemonCard, selected === k && styles.pokemonCardSelected]}
                onPress={() => setSelected(k)}
              >
                <Image source={{ uri: POKEMON_SPRITES[k] }} style={styles.pokemonSelectImage} />
                <Text style={styles.pokemonName}>{k}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Texto de puntaje máximo y botón Jugar más arriba */}
          <View style={{ marginTop: 30, alignItems: 'center' }}>
            <Text style={{ fontSize: SCREEN_WIDTH * 0.045, marginBottom: 12 }}>Puntuación máxima: {best}</Text>
            <TouchableOpacity style={styles.button} onPress={() => startGame(selected)}>
              <Text style={styles.buttonText}>Jugar</Text>
            </TouchableOpacity>
          </View>

        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  // -------------------- PANTALLA JUEGO --------------------
  if (screen === 'game') {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={[styles.container, { paddingBottom: insets.bottom + 10 }]}>
          <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }}>
            <Text style={styles.header}>Puntaje: {score} Mejor: {best}</Text>

            <View style={styles.gameArea}>
              {Array.from({ length: GRID_ROWS }).map((_, row) => (
                <View key={`r-${row}`} style={styles.row}>
                  {Array.from({ length: GRID_COLS }).map((__, col) => renderCell(col, row))}
                </View>
              ))}
              {countdown !== null && countdown > 0 && (
                <View style={styles.countdownOverlay}>
                  <Text style={styles.countdownText}>{countdown === 0 ? '¡GO!' : countdown}</Text>
                </View>
              )}
            </View>

            {/* 🎮 D-Pad */}
            <View style={styles.dpadBase}>
              <View style={styles.dpadCross}>
                <TouchableOpacity style={[styles.dpadButton, styles.dpadUp]} onPress={() => changeDir('UP')}><Text style={styles.dpadArrow}>▲</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.dpadButton, styles.dpadLeft]} onPress={() => changeDir('LEFT')}><Text style={styles.dpadArrow}>◀</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.dpadButton, styles.dpadRight]} onPress={() => changeDir('RIGHT')}><Text style={styles.dpadArrow}>▶</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.dpadButton, styles.dpadDown]} onPress={() => changeDir('DOWN')}><Text style={styles.dpadArrow}>▼</Text></TouchableOpacity>
                <View style={styles.dpadCenter} />
              </View>
            </View>

          </ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  // -------------------- PANTALLA GAMEOVER --------------------
  if (screen === 'gameover') {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <Text style={styles.title}>¡Game Over!</Text>
          <Text style={styles.subtitle}>Puntaje: {score}</Text>
          <Text style={styles.subtitle}>Mejor: {best}</Text>
          <TouchableOpacity style={styles.button} onPress={() => startGame(selected)}><Text style={styles.buttonText}>Jugar otra vez</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#888' }]} onPress={() => setScreen('menu')}><Text style={styles.buttonText}>Volver al menú</Text></TouchableOpacity>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return null;
}

// -------------------- ESTILOS --------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f3', alignItems: 'center', paddingTop: '5%' },
  title: { fontSize: SCREEN_WIDTH * 0.08, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: SCREEN_WIDTH * 0.04, color: '#444', marginBottom: 12 },
  pokemonCard: { width: SCREEN_WIDTH * 0.25, height: SCREEN_WIDTH * 0.3, backgroundColor: '#fff', borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginHorizontal: 6, borderWidth: 1, borderColor: '#ddd', padding: 6 },
  pokemonCardSelected: { borderColor: '#4caf50', shadowColor: '#4caf50', shadowOpacity: 0.3, shadowRadius: 6 },
  pokemonSelectImage: { width: SCREEN_WIDTH * 0.15, height: SCREEN_WIDTH * 0.15, marginBottom: 6 },
  pokemonName: { textTransform: 'capitalize' },
  button: { marginTop: 12, backgroundColor: '#3b82f6', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: '600' },
  header: { fontSize: SCREEN_WIDTH * 0.045, marginBottom: 8 },
  gameArea: { width: GAME_AREA_WIDTH, height: GAME_AREA_HEIGHT, borderWidth: 2, borderColor: '#2e7d32', backgroundColor: '#a5d6a7', overflow: 'hidden', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  countdownOverlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.6)' },
  countdownText: { fontSize: SCREEN_WIDTH * 0.15, fontWeight: '800', color: '#1b5e20' },
  row: { flexDirection: 'row' },
  cell: { width: CELL_SIZE, height: CELL_SIZE, borderWidth: 0.5, borderColor: '#4caf50', alignItems: 'center', justifyContent: 'center', backgroundColor: '#81c784' },
  cellHead: { backgroundColor: '#2e7d32' },
  cellBody: { backgroundColor: '#388e3c' },
  cellFood: { backgroundColor: '#ffeb3b' },
  pokemonImage: { width: CELL_SIZE * 0.8, height: CELL_SIZE * 0.8, resizeMode: 'contain' },
  pokemonImageSmall: { width: CELL_SIZE * 0.6, height: CELL_SIZE * 0.6, resizeMode: 'contain', opacity: 0.9 },

  // D-Pad
  dpadBase: { backgroundColor: '#cfcfcf', borderRadius: 100, width: SCREEN_WIDTH * 0.4, height: SCREEN_WIDTH * 0.4, marginTop: 16, alignItems: 'center', justifyContent: 'center' },
  dpadCross: { position: 'relative', width: '90%', height: '90%', alignItems: 'center', justifyContent: 'center' },
  dpadButton: { position: 'absolute', width: SCREEN_WIDTH * 0.13, height: SCREEN_WIDTH * 0.13, backgroundColor: '#222', borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  dpadUp: { top: 0 }, dpadDown: { bottom: 0 }, dpadLeft: { left: 0 }, dpadRight: { right: 0 },
  dpadCenter: { width: SCREEN_WIDTH * 0.18, height: SCREEN_WIDTH * 0.18, backgroundColor: '#444', borderRadius: SCREEN_WIDTH * 0.09 },
  dpadArrow: { fontSize: SCREEN_WIDTH * 0.05, color: '#fff', fontWeight: 'bold' },
});
