import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView, SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient'; // 🌈 Fondo degradado

// --- Sprites ---
const SNAKE_SPRITES = {
  cabeza: require('../assets/Cabezaa.png'),
  cuerpo: require('../assets/Cuerpoo.png'),
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_COLS = 8;
const GRID_ROWS = 8;
const GAME_AREA_WIDTH = SCREEN_WIDTH * 0.8;
const CELL_SIZE = GAME_AREA_WIDTH / GRID_COLS;
const INITIAL_SPEED = 250;
const STORAGE_KEY_BEST = '@pokemon_snake_best_score';

const randPos = () => ({
  x: Math.floor(Math.random() * GRID_COLS),
  y: Math.floor(Math.random() * GRID_ROWS),
});
const positionsEqual = (a, b) => a.x === b.x && a.y === b.y;

export default function MiniGame() {
  const [screen, setScreen] = useState('menu');
  const [snake, setSnake] = useState([]);
  const [direction, setDirection] = useState('RIGHT');
  const [food, setFood] = useState(randPos());
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [countdown, setCountdown] = useState(null);
  const [time, setTime] = useState(0);

  const intervalRef = useRef(null);
  const timerRef = useRef(null);
  const dirRef = useRef(direction);
  dirRef.current = direction;
  const insets = useSafeAreaInsets();

  // 🎵 Sonidos
  const baseSound = useRef();
  const eatSound = useRef();
  const deathSound = useRef();

  useEffect(() => {
    async function loadSounds() {
      try {
        baseSound.current = new Audio.Sound();
        eatSound.current = new Audio.Sound();
        deathSound.current = new Audio.Sound();

        await baseSound.current.loadAsync(require('../assets/SonidoBase.mp3'));
        await eatSound.current.loadAsync(require('../assets/Comer.mp3'));
        await deathSound.current.loadAsync(require('../assets/Over.mp3'));

        await baseSound.current.setVolumeAsync(0.4);
        await eatSound.current.setVolumeAsync(0.7);
        await deathSound.current.setVolumeAsync(0.8);
      } catch (e) {
        console.log('Error loading sounds:', e);
      }
    }

    loadSounds();
    return () => {
      baseSound.current?.unloadAsync();
      eatSound.current?.unloadAsync();
      deathSound.current?.unloadAsync();
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const v = await AsyncStorage.getItem(STORAGE_KEY_BEST);
        if (v) setBest(parseInt(v, 10));
      } catch (e) {
        console.log('Error loading best', e);
      }
    })();
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (running) startLoop();
    else stopLoop();
    return () => stopLoop();
  }, [running, speed]);

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
  };

  const stopTimer = () => clearInterval(timerRef.current);

  const startLoop = () => {
    stopLoop();
    intervalRef.current = setInterval(() => step(), speed);
  };

  const stopLoop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const startGame = async () => {
    await baseSound.current?.stopAsync();
    const startPos = { x: Math.floor(GRID_COLS / 2), y: Math.floor(GRID_ROWS / 2) };
    const initialSnake = [
      { x: startPos.x - 1, y: startPos.y },
      { x: startPos.x, y: startPos.y },
    ];

    setSnake(initialSnake);
    setDirection('RIGHT');
    setFood(generateFood(initialSnake));
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setTime(0);
    setScreen('game');
    setCountdown(3);

    let count = 3;
    const timer = setInterval(() => {
      setCountdown(count);
      count--;
      if (count < 0) {
        clearInterval(timer);
        setCountdown(null);
        setRunning(true);
        startTimer();
        baseSound.current?.setIsLoopingAsync(true);
        baseSound.current?.playAsync();
      }
    }, 1000);
  };

  const gameOver = async () => {
    setRunning(false);
    stopLoop();
    stopTimer();

    try {
      await baseSound.current?.stopAsync();
      await deathSound.current?.replayAsync();
    } catch (e) {
      console.log('Error reproducir sonidos', e);
    }

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

  const changeDir = (newDir) => {
    const opposite = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };
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
    if (!running) return;
    setSnake(old => {
      const head = { ...old[old.length - 1] };
      const dir = dirRef.current;
      if (dir === 'UP') head.y -= 1;
      else if (dir === 'DOWN') head.y += 1;
      else if (dir === 'LEFT') head.x -= 1;
      else if (dir === 'RIGHT') head.x += 1;

      if (head.x < 0 || head.x >= GRID_COLS || head.y < 0 || head.y >= GRID_ROWS) {
        gameOver();
        return old;
      }

      for (let i = 0; i < old.length; i++)
        if (positionsEqual(head, old[i])) {
          gameOver();
          return old;
        }

      let newSnake = [...old.slice(1), head];
      if (positionsEqual(head, food)) {
        newSnake = [...old, head];
        setFood(generateFood(newSnake));
        setScore(s => s + 1);
        setSpeed(s => Math.max(60, s - 5));
        eatSound.current?.replayAsync();
      }

      return newSnake;
    });
  };

  const renderSnake = () =>
    snake.map((seg, idx) => (
      <Image
        key={`s-${idx}`}
        source={idx === snake.length - 1 ? SNAKE_SPRITES.cabeza : SNAKE_SPRITES.cuerpo}
        style={{
          position: 'absolute',
          width: CELL_SIZE,
          height: CELL_SIZE,
          left: seg.x * CELL_SIZE,
          top: seg.y * CELL_SIZE,
          resizeMode: 'contain',
          zIndex: idx === snake.length - 1 ? 2 : 1,
        }}
      />
    ));

  const renderGrid = () =>
    Array.from({ length: GRID_ROWS }).map((_, row) => (
      <View key={`r-${row}`} style={styles.row}>
        {Array.from({ length: GRID_COLS }).map((__, col) => (
          <View key={`c-${col}`} style={styles.cell}>
            {positionsEqual(food, { x: col, y: row }) && (
              <Text style={{ fontSize: CELL_SIZE * 0.5 }}>🍓</Text>
            )}
          </View>
        ))}
      </View>
    ));

  // --- Pantalla del menú ---
  if (screen === 'menu') {
    return (
      <SafeAreaProvider>
        <LinearGradient colors={['#b3e5fc', '#e1f5fe', '#ffffff']} style={styles.gradient}>
          <SafeAreaView style={styles.container}>
            <View style={styles.overlay}>
              <Text style={styles.gameTitle}>Poké-Snake</Text>
              <Image
                source={{
                  uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10.png',
                }}
                style={styles.caterpieImage}
                resizeMode="contain"
              />
              <Text style={styles.subtitle}>¡Juega con Caterpie!</Text>
              <Text style={styles.subtitle}>Mejor puntaje: {best}</Text>
              <TouchableOpacity style={styles.playButton} onPress={startGame}>
                <Text style={styles.playButtonText}>🎮 Jugar</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </SafeAreaProvider>
    );
  }

  // --- Pantalla del juego ---
  if (screen === 'game') {
    return (
      <SafeAreaProvider>
        <LinearGradient colors={['#b3e5fc', '#e1f5fe', '#ffffff']} style={styles.gradient}>
          <SafeAreaView style={[styles.container, { paddingBottom: insets.bottom + 10 }]}>
            <Text style={styles.header}>
              Puntaje: {score} Tiempo: {time}s Mejor: {best}
            </Text>
            <View style={styles.gameArea}>
              {renderGrid()}
              {renderSnake()}
              {countdown !== null && (
                <View style={styles.countdownOverlay}>
                  <Text style={styles.countdownText}>{countdown === 0 ? '¡GO!' : countdown}</Text>
                </View>
              )}
            </View>

            {/* D-Pad */}
            <View style={styles.dpadBase}>
              <View style={styles.dpadCross}>
                <TouchableOpacity style={[styles.dpadButton, styles.dpadUp]} onPress={() => changeDir('UP')}>
                  <Text style={styles.dpadArrow}>▲</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.dpadButton, styles.dpadLeft]} onPress={() => changeDir('LEFT')}>
                  <Text style={styles.dpadArrow}>◀</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.dpadButton, styles.dpadRight]} onPress={() => changeDir('RIGHT')}>
                  <Text style={styles.dpadArrow}>▶</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.dpadButton, styles.dpadDown]} onPress={() => changeDir('DOWN')}>
                  <Text style={styles.dpadArrow}>▼</Text>
                </TouchableOpacity>
                <View style={styles.dpadCenter} />
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </SafeAreaProvider>
    );
  }

  // --- Pantalla Game Over ---
  if (screen === 'gameover') {
    return (
      <SafeAreaProvider>
        <LinearGradient colors={['#b3e5fc', '#e1f5fe', '#ffffff']} style={styles.gradient}>
          <SafeAreaView style={styles.container}>
            <Text style={styles.title}>¡Game Over!</Text>
            <Text style={styles.subtitle}>Puntaje: {score}</Text>
            <Text style={styles.subtitle}>Tiempo: {time}s</Text>
            <Text style={styles.subtitle}>Mejor: {best}</Text>

            <TouchableOpacity style={styles.playButton} onPress={startGame}>
              <Text style={styles.playButtonText}>🔁 Volver a jugar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.playButton, { backgroundColor: '#777', marginTop: 10 }]}
              onPress={() => setScreen('menu')}
            >
              <Text style={styles.playButtonText}>🏠 Volver al inicio</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </LinearGradient>
      </SafeAreaProvider>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameTitle: {
    fontSize: SCREEN_WIDTH * 0.12,
    fontWeight: '900',
    color: '#0277bd',
    textShadowColor: '#81d4fa',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
    marginBottom: 20,
  },
  caterpieImage: {
    width: 200,
    height: 200,
    marginVertical: 12,
  },
  playButton: {
    marginTop: 20,
    backgroundColor: '#0288d1',
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderRadius: 40,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 5,
  },
  playButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: SCREEN_WIDTH * 0.05,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: SCREEN_WIDTH * 0.08,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: SCREEN_WIDTH * 0.045,
    color: '#444',
    marginBottom: 12,
  },
  header: {
    fontSize: SCREEN_WIDTH * 0.045,
    marginBottom: 8,
    textAlign: 'center',
  },
  gameArea: {
    width: GAME_AREA_WIDTH,
    height: GAME_AREA_WIDTH,
    borderWidth: 2,
    borderColor: '#2e7d32',
    backgroundColor: '#a5d6a7',
    overflow: 'hidden',
    borderRadius: 8,
  },
  row: { flexDirection: 'row' },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 0.5,
    borderColor: '#4caf50',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#81c784',
  },
  countdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  countdownText: {
    fontSize: SCREEN_WIDTH * 0.15,
    fontWeight: '800',
    color: '#1b5e20',
  },
  dpadBase: {
    backgroundColor: '#cfcfcf',
    borderRadius: 100,
    width: SCREEN_WIDTH * 0.4,
    height: SCREEN_WIDTH * 0.4,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dpadCross: {
    position: 'relative',
    width: '90%',
    height: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dpadButton: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.13,
    height: SCREEN_WIDTH * 0.13,
    backgroundColor: '#222',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dpadUp: { top: 0 },
  dpadDown: { bottom: 0 },
  dpadLeft: { left: 0 },
  dpadRight: { right: 0 },
  dpadCenter: {
    width: SCREEN_WIDTH * 0.18,
    height: SCREEN_WIDTH * 0.18,
    backgroundColor: '#444',
    borderRadius: SCREEN_WIDTH * 0.09,
  },
  dpadArrow: {
    fontSize: SCREEN_WIDTH * 0.05,
    color: '#fff',
    fontWeight: 'bold',
  },
});
