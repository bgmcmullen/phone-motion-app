import React, { useState, useEffect } from 'react';
import { StyleSheet, Animated, Text, TouchableOpacity, View } from 'react-native';
import { Accelerometer } from 'expo-sensors';

export default function App() {


  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscription, setSubscription] = useState(null);
  const [position, setPosition] = useState(new Animated.ValueXY({ x: 0, y: 0 }));

  const [intersects, setIntersects] = useState('false');

  const _slow = () => Accelerometer.setUpdateInterval(500);
  const _fast = () => Accelerometer.setUpdateInterval(50);

  const _subscribe = () => {
    setSubscription(Accelerometer.addListener(setData));
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    Animated.timing(position, {
      toValue: { x: x * 50, y: y * 50 },
      duration: 100,
      useNativeDriver: true,
    }).start();
    return () => _unsubscribe();

    
  }, []);

  // from chatgpt
  function rectanglesIntersect(rect1, rect2) {
    return (
      rect1.x < rect2.x + rect2.width ||
      rect1.x + rect1.width > rect2.x ||
      rect1.y < rect2.y + rect2.height ||
      rect1.y + rect1.height > rect2.y
    );
  }


  

  return (
    <>
      <View style={styles.container}>
        <Animated.View style={{width: 50, height: 50, backgroundColor: 'blue', marginLeft:  140 + (x * 200), marginTop: 300 - (y * 800)}} />
      </View>
      <View style={styles.container}>
        <Animated.View style={{width: 50, height: 50, backgroundColor: 'red', marginLeft: 20, marginTop: 60}} />
      </View>
      <View style={styles.container}>
        <Text style={styles.text}>Accelerometer: (in gs where 1g = 9.81 m/s^2)</Text>
        <Text style={styles.text}>x: {x}</Text>
        <Text style={styles.text}>y: {y}</Text>
        <Text style={styles.text}>z: {z}</Text>
        <Text style={styles.text}>intersects: {intersects}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={subscription ? _unsubscribe : _subscribe} style={styles.button}>
            <Text>{subscription ? 'On' : 'Off'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={_slow} style={[styles.button, styles.middleButton]}>
            <Text>Slow</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={_fast} style={styles.button}>
            <Text>Fast</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  text: {
    textAlign: 'center',
    color: 'white'
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 15,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  box: {
    width: 50,
    height: 50,
    backgroundColor: 'blue',
  },
});
