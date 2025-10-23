// src/screens/MiniGame.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- Sprites ---
const POKEMON_SPRITES = {
  caterpie: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10.png',
  weedle: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/13.png',
  wurmple: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/265.png',
};

// --- Grid settings ---
const { width, height } = Dimensions.get('window');
const GRID_COLS = 12;
const GRID_ROWS = 18;
const CELL_SIZE = Math.floor(Math.min(width * 0.9 / GRID_COLS, 36));
const GAME_AREA_WIDTH = CELL_SIZE * GRID_COLS;
const GAME_AREA_HEIGHT = CELL_SIZE * GRID_ROWS;
const INITIAL_SPEED = 180;
const STORAGE_KEY_BEST = '@pokemon_snake_best_score';

// --- Helpers ---
const randPos = () => ({
  x: Math.floor(Math.random() * GRID_COLS),
  y: Math.floor(Math.random() * GRID_ROWS),
});

const positionsEqual = (a, b) => a.x === b.x && a.y === b.y;

// --- COMPONENTE ---
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

  const intervalRef = useRef(null);
  const dirRef = useRef(direction);
  dirRef.current = direction;

  // --- Cargar mejor puntaje ---
  useEffect(() => {
    (async () => {
      try {
        const v = await AsyncStorage.getItem(STORAGE_KEY_BEST);
        if (v) setBest(parseInt(v, 10));
      } catch (e) {
        console.log('Error loading best', e);
      }
    })();

    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (running) startLoop();
    else stopLoop();
    return () => stopLoop();
  }, [running, speed]);

  // --- Iniciar juego ---
  const startGame = (starterPokemon) => {
    setSelected(starterPokemon || selected);
    const startPos = { x: Math.floor(GRID_COLS / 2), y: Math.floor(GRID_ROWS / 2) };
    setSnake([startPos, { x: startPos.x - 1, y: startPos.y }, { x: startPos.x - 2, y: startPos.y }]);
    setDirection('RIGHT');
    setFood(generateFood([startPos]));
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setRunning(true);
    setScreen('game');
  };

  // --- Game Over ---
  const gameOver = async () => {
    setRunning(false);
    setScreen('gameover');
    try {
      if (score > best) {
        await AsyncStorage.setItem(STORAGE_KEY_BEST, String(score));
        setBest(score);
      }
    } catch (e) {
      console.log('Error saving best', e);
    }
  };

  const startLoop = () => {
    stopLoop();
    intervalRef.current = setInterval(() => {
      step();
    }, speed);
  };
  const stopLoop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const changeDir = (newDir) => {
    const opposite = {
      UP: 'DOWN',
      DOWN: 'UP',
      LEFT: 'RIGHT',
      RIGHT: 'LEFT',
    };
    if (opposite[newDir] === dirRef.current) return;
    setDirection(newDir);
  };

  const generateFood = (currentSnake) => {
    let p = randPos();
    let tries = 0;
    while (currentSnake.some(s => positionsEqual(s, p)) && tries < 200) {
      p = randPos();
      tries++;
    }
    return p;
  };

  const step = () => {
    setSnake(old => {
      const head = { ...old[0] };
      const dir = dirRef.current;
      if (dir === 'UP') head.y -= 1;
      else if (dir === 'DOWN') head.y += 1;
      else if (dir === 'LEFT') head.x -= 1;
      else if (dir === 'RIGHT') head.x += 1;

      // Wall collision
      if (head.x < 0 || head.x >= GRID_COLS || head.y < 0 || head.y >= GRID_ROWS) {
        gameOver();
        return old;
      }

      // Self collision
      for (let i = 0; i < old.length; i++) {
        if (positionsEqual(head, old[i])) {
          gameOver();
          return old;
        }
      }

      let newSnake = [head, ...old.slice(0, old.length - 1)];

      // Eating
      if (positionsEqual(head, food)) {
        newSnake = [head, ...old];
        setFood(generateFood(newSnake));
        setScore(s => s + 1);
        setSpeed(s => Math.max(60, s - 5));
      }

      return newSnake;
    });
  };

  const renderCell = (x, y) => {
    const isHead = snake.length > 0 && positionsEqual(snake[0], { x, y });
    const isBody = snake.some((p, idx) => idx > 0 && positionsEqual(p, { x, y }));
    const isFood = positionsEqual(food, { x, y });

    if (isHead) {
      return (
        <View key={`${x}-${y}`} style={[styles.cell, styles.cellHead]}>
          <Image source={{ uri: POKEMON_SPRITES[selected] }} style={styles.pokemonImage} />
        </View>
      );
    }
    if (isBody) {
      return (
        <View key={`${x}-${y}`} style={[styles.cell, styles.cellBody]}>
          <Image source={{ uri: POKEMON_SPRITES[selected] }} style={styles.pokemonImageSmall} />
        </View>
      );
    }
    if (isFood) {
      return (
        <View key={`${x}-${y}`} style={[styles.cell, styles.cellFood]}>
          <Text style={{ fontSize: 12 }}>🍓</Text>
        </View>
      );
    }
    return <View key={`${x}-${y}`} style={styles.cell} />;
  };

  // --- Pantallas ---
  if (screen === 'menu') {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Poké-Snake</Text>
        <Text style={styles.subtitle}>Elige tu Pokémon</Text>

        <View style={styles.selectionRow}>
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
        </View>

        <TouchableOpacity style={styles.button} onPress={() => startGame(selected)}>
          <Text style={styles.buttonText}>Jugar</Text>
        </TouchableOpacity>

        <View style={styles.infoRow}>
          <Text>Puntuación máxima: {best}</Text>
          <Text>Táctil: usa los botones para moverte.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (screen === 'game') {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Puntaje: {score}    Mejor: {best}</Text>

        <View style={styles.gameArea}>
          {Array.from({ length: GRID_ROWS }).map((_, row) => (
            <View key={`r-${row}`} style={styles.row}>
              {Array.from({ length: GRID_COLS }).map((__, col) => renderCell(col, row))}
            </View>
          ))}
        </View>

        <View style={styles.controlsRow}>
          <View style={styles.controlsColumn}>
            <TouchableOpacity style={styles.ctrlBtn} onPress={() => changeDir('UP')}>
              <Text style={styles.ctrlText}>▲</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.controlsColumnMid}>
            <TouchableOpacity style={styles.ctrlBtn} onPress={() => changeDir('LEFT')}>
              <Text style={styles.ctrlText}>◀</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ctrlBtn} onPress={() => changeDir('RIGHT')}>
              <Text style={styles.ctrlText}>▶</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.controlsColumn}>
            <TouchableOpacity style={styles.ctrlBtn} onPress={() => changeDir('DOWN')}>
              <Text style={styles.ctrlText}>▼</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomRow}>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#f44336' }]} onPress={() => { setRunning(false); setScreen('menu'); }}>
            <Text style={styles.buttonText}>Salir</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setRunning(!running)}>
            <Text style={styles.buttonText}>{running ? 'Pausar' : 'Reanudar'}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (screen === 'gameover') {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>¡Game Over!</Text>
        <Text style={styles.subtitle}>Puntaje: {score}</Text>
        <Text style={styles.subtitle}>Mejor: {best}</Text>

        <TouchableOpacity style={styles.button} onPress={() => startGame(selected)}>
          <Text style={styles.buttonText}>Jugar otra vez</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: '#888' }]} onPress={() => setScreen('menu')}>
          <Text style={styles.buttonText}>Volver al menú</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return null;
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    alignItems: 'center',
    paddingTop: 24,
  },
  title: { fontSize: 32, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#444', marginBottom: 12 },
  selectionRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 20 },
  pokemonCard: {
    width: 100, height: 120, backgroundColor: '#fff', borderRadius: 8, alignItems: 'center',
    justifyContent: 'center', marginHorizontal: 6, borderWidth: 1, borderColor: '#ddd', padding: 6,
  },
  pokemonCardSelected: { borderColor: '#4caf50', shadowColor: '#4caf50', shadowOpacity: 0.3, shadowRadius: 6 },
  pokemonSelectImage: { width: 64, height: 64, marginBottom: 6 },
  pokemonName: { textTransform: 'capitalize' },
  button: { marginTop: 12, backgroundColor: '#3b82f6', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: '600' },
  infoRow: { marginTop: 10, alignItems: 'center' },
  header: { fontSize: 18, marginBottom: 8 },
  gameArea: {
    width: GAME_AREA_WIDTH, height: GAME_AREA_HEIGHT, borderWidth: 2, borderColor: '#333',
    backgroundColor: '#e8f5e9', overflow: 'hidden', borderRadius: 8, alignItems: 'center', justifyContent: 'center',
  },
  row: { flexDirection: 'row' },
  cell: {
    width: CELL_SIZE, height: CELL_SIZE, borderWidth: 0.2, borderColor: '#d0d0d0',
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#e8f5e9',
  },
  cellHead: { backgroundColor: '#c8e6c9' },
  cellBody: { backgroundColor: '#a5d6a7' },
  cellFood: { backgroundColor: '#fff3e0' },
  pokemonImage: { width: CELL_SIZE * 0.9, height: CELL_SIZE * 0.9, resizeMode: 'contain' },
  pokemonImageSmall: { width: CELL_SIZE * 0.7, height: CELL_SIZE * 0.7, resizeMode: 'contain', opacity: 0.9 },
  controlsRow: { marginTop: 12, width: GAME_AREA_WIDTH, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
  controlsColumn: { alignItems: 'center', justifyContent: 'center' },
  controlsColumnMid: { alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  ctrlBtn: {
    width: 56, height: 56, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc',
    alignItems: 'center', justifyContent: 'center', marginHorizontal: 8, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4,
  },
  ctrlText: { fontSize: 24 },
  bottomRow: { marginTop: 14, flexDirection: 'row', gap: 12 },
});
